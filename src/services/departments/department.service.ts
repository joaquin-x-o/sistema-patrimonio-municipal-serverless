import { createDepartmentDb, deleteDepartmentDb, disableDepartmentDB, enableDepartmentDB, getDepartmentByCodeDb, getDepartmentId, getDepartmentListDb, getDepartmentProductCountStatsDb, getDepartmentsDb, updateDepartmentDb } from "../../repositories/departments/department.repository";
import type { DepartmentProductCountStats } from "../../interfaces/responses/departmentProductCountStats";
import type { PaginationParams } from "../../interfaces/params/paginationParams";
import type { DepartmentLightResponse, DepartmentResponse } from "../../interfaces/responses/departmentResponse";
import { mapDepartmentRowToLightResponse, mapDepartmentRowToProductCountStats, mapDepartmentRowToResponse, mapDepartmentWithCountRowToResponse } from "../../lib/maps/responses/departmentResponseMapper";
import type { CreateDepartmentRequest, UpdateDepartmentRequest } from "../../schemas/department.schemas";
import { mapCreateDepartmentRequestToDto, mapUpdateDepartmentRequestToDto } from "../../lib/maps/requests/departmentRequestMapper";
import { createLog } from "../logHistory/logHistory.service";
import { LogActionType, LogEntityType } from "../../types/log.type";
import { getLogDescription } from "../../lib/logMessage/logDescriptions";
import { buildLogDiff } from "../../utils/logUtils/buildLogDiff";
import { mapDepartmentsForExport } from "../../lib/maps/excel/mapDepartmentForExport";

interface DepartmentProductCountStatsDb {
    code: string;
    name: string;
    product_count: number;
}

// obtener areas con paginación 
export const getDepartments = async ({ page = 1, limit = 10 }: PaginationParams) => {
    const allDepartments = await getDepartmentsDb();

    const totalProducts = allDepartments.reduce((sum, d) => sum + Number(d.product_count), 0);

    const mapped: DepartmentResponse[] = allDepartments.map(d =>
        mapDepartmentWithCountRowToResponse(d, totalProducts)
    );

    const total = mapped.length;
    const start = (page - 1) * limit;
    const paginated = mapped.slice(start, start + limit);

    return {
        data: paginated,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
    };

};

// obtener todas las áreas para exportar a excel (sin paginacion)
export const getAllDepartmentsForExport = async () => {
  const allDepartments = await getDepartmentsDb();
  const totalProducts = allDepartments.reduce((sum, d) => sum + Number(d.product_count), 0);

  const mapped: DepartmentResponse[] = allDepartments.map(d =>
    mapDepartmentWithCountRowToResponse(d, totalProducts)
  );

  const exportableData = mapDepartmentsForExport(mapped);
  return exportableData;
} 

// obtener area por codigo
export const getDepartmentByCode = async (code: string) => {
    const data = await getDepartmentByCodeDb(code);

    const department: DepartmentResponse = mapDepartmentRowToResponse(data)
    return department;
};

export const getDepartmentLightList = async (): Promise<DepartmentLightResponse[]> => {
    const data = await getDepartmentListDb();

    const departmentList = (data ?? []).map(mapDepartmentRowToLightResponse)

    return departmentList;
};

// obtener estadisticas de cantidad de productos por departamento
export const getDepartmentProductCountStats = async (limit: number) => {
    const data = await getDepartmentProductCountStatsDb(limit) as DepartmentProductCountStatsDb[];

    const response: DepartmentProductCountStats[] = (data ?? []).map(mapDepartmentRowToProductCountStats);

    return response;
};

// ACCIONES -------------------------------

// crear area
export const createDepartment = async (request: CreateDepartmentRequest) => {
    const dto = mapCreateDepartmentRequestToDto(request);

    try {
        const createdDepartment = await createDepartmentDb(dto);

        await createLog({
            action: LogActionType.CREATE_DEPARTMENT,
            entityType: LogEntityType.DEPARTMENT,
            entityCode: createdDepartment.code,
            description: getLogDescription(
                LogActionType.CREATE_DEPARTMENT,
                createdDepartment.code
            ),
            newData: {
                department: `${createdDepartment.name} (${createdDepartment.code})`
            }
        });

        return mapDepartmentRowToResponse(createdDepartment);

    } catch (error: any) {
        if (error.code === "23505") {
            throw new Error("El código de área ya está en uso.");
        }

        throw error;
    }
};

// actualizar area
export const updateDepartment = async (departmentCode: string, request: UpdateDepartmentRequest) => {

    const departmentId = await getDepartmentId(departmentCode);
    const department = await getDepartmentByCode(departmentCode);

    const dto = mapUpdateDepartmentRequestToDto(request);

    try {
        const updatedDepartment = await updateDepartmentDb(departmentId, dto);
        const response = mapDepartmentRowToResponse(updatedDepartment);

        const { oldData, newData } = buildLogDiff(department, request);
        const hasChanges = Object.keys(newData).length > 0;

        if (hasChanges) {
            await createLog({
                action: LogActionType.EDIT_DEPARTMENT,
                entityType: LogEntityType.DEPARTMENT,
                entityCode: departmentCode,
                description: getLogDescription(
                    LogActionType.EDIT_DEPARTMENT,
                    departmentCode
                ),
                oldData,
                newData
            });
        }

        return response;

    } catch (error: any) {
        if (error.code === "23505") {
            throw new Error("El nuevo código ya está en uso.");
        }

        throw error;
    }
};


// habilitar area
export const enableDepartment = async (departmentCode: string) => {
    const departmentId = await getDepartmentId(departmentCode);
    const department = await getDepartmentByCode(departmentCode);

    if (department.isActive) {
        throw new Error("El área ya se encuentra activa.");
    }

    const enabledDepartment = await enableDepartmentDB(departmentId);

    await createLog({
        action: LogActionType.ENABLE_DEPARTMENT,
        entityType: LogEntityType.DEPARTMENT,
        entityCode: departmentCode,
        description: getLogDescription(
            LogActionType.ENABLE_DEPARTMENT,
            departmentCode
        ),
        oldData: {
            updatedAt: department.updatedAt
        },
        newData: {
            updatedAt: enabledDepartment.updated_at
        }
    });

    return mapDepartmentRowToResponse(enabledDepartment);
};

// deshabilitar area
export const disableDepartment = async (departmentCode: string) => {
    const departmentId = await getDepartmentId(departmentCode);
    const department = await getDepartmentByCode(departmentCode);

    if (!department.isActive) {
        throw new Error("El área ya se encuentra inactiva.");
    }

    const disabledDepartment = await disableDepartmentDB(departmentId);

    await createLog({
        action: LogActionType.DISABLE_DEPARTMENT,
        entityType: LogEntityType.DEPARTMENT,
        entityCode: departmentCode,
        description: getLogDescription(
            LogActionType.DISABLE_DEPARTMENT,
            departmentCode
        ),
        oldData: {
            updatedAt: department.updatedAt
        },
        newData: {
            updatedAt: disabledDepartment.updated_at
        }
    });

    return mapDepartmentRowToResponse(disabledDepartment);
};


// borrar area (hard delete)
export const deleteDepartment = async (departmentCode: string) => {

    const departmentId = await getDepartmentId(departmentCode);
    const department = await getDepartmentByCode(departmentCode);

    try {
        await deleteDepartmentDb(departmentId);

        await createLog({
            action: LogActionType.DELETE_DEPARTMENT,
            entityType: LogEntityType.DEPARTMENT,
            entityCode: departmentCode,
            description: getLogDescription(
                LogActionType.DELETE_DEPARTMENT,
                departmentCode
            ),
            oldData: {
                department: `${department.name} (${department.departmentCode})`
            }
        });

        return true;

    } catch (error: any) {
        const errorMessage = error.message || "";

        if (errorMessage.includes("violates foreign key constraint") || error.code === "23503") {
            throw new Error(
                "No se puede eliminar el área porque está asociada a otros registros. Opte por deshabilitarla."
            );
        }

        throw new Error(error.message);
    }
};
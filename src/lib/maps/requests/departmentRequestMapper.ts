import type { CreateDepartmentDto, UpdateDepartmentDto } from "../../../interfaces/requests/departmentRequests";
import type { CreateDepartmentRequest, UpdateDepartmentRequest } from "../../../schemas/department.schemas";
import { getTodayDateISO } from "../../../utils/date/getTodayDate";

export const mapCreateDepartmentRequestToDto = (request: CreateDepartmentRequest): CreateDepartmentDto => {

    return {
        departmentCode: request.departmentCode.toUpperCase(),
        name: request.name.trim(),
        responsibleName: request.responsibleName
    };
};

export const mapUpdateDepartmentRequestToDto = (request: UpdateDepartmentRequest): UpdateDepartmentDto => {
    const today = getTodayDateISO();

    return {
        departmentCode: request.departmentCode ? request.departmentCode.toUpperCase() : undefined,
        name: request.name ? request.name.trim() : undefined,
        responsibleName: request.responsibleName ? request.responsibleName.trim() : undefined,
        updatedAt: today
    };
};

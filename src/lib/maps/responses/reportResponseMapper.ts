import type { LogResponse } from "../../../interfaces/responses/logHistoryResponse";
import type { LossHistoryResponse } from "../../../interfaces/responses/lossHistoryResponse";
import type { MaintenanceHistoryResponse } from "../../../interfaces/responses/maintenanceHistoryResponse";
import type { MovementHistoryResponse } from "../../../interfaces/responses/movementHistoryResponse";
import type { RetirementHistoryResponse } from "../../../interfaces/responses/retirementHistoryResponse";
import type { ActionType, EntityType } from "../../../types/log.type";
import type { LossType } from "../../../types/lost.type";
import type { RetirementType } from "../../../types/retirement.type";


// mapeo de datos de reportes que vienen de la base de datos a una respuesta predefinida por el sistema

// mapeo reporte de bajas
export const mapRetirementRowReportToResponse = (r: any): RetirementHistoryResponse => {
    const product = Array.isArray(r.product) ? r.product[0] : r.product;
    const dept = Array.isArray(product?.department) ? product.department[0] : product?.department;
    const usr = Array.isArray(r.user) ? r.user[0] : r.user;

    return {
        documentReference: r.doc_reference,
        retirementReason: r.reason,
        retirementType: r.type as RetirementType,
        transactionDate: r.date,
        product: {
            productCode: product?.code,
            name: product?.name
        },
        user: {
            name: usr?.name,
            surname: usr?.surname
        },
        department: {
            departmentCode: dept?.code,
            name: dept?.name,
            responsibleName: dept?.responsible_name
        }
    };
};


// mapeo reporte de perdida
export const mapLossRowReportToResponse = (r: any): LossHistoryResponse => {
    const product = Array.isArray(r.product) ? r.product[0] : r.product;
    const dept = Array.isArray(r.department) ? r.department[0] : r.department;
    const usr = Array.isArray(r.user) ? r.user[0] : r.user;

    return {
        complaintReference: r.complaint_reference,
        lossDate: r.date,
        lossType: r.type as LossType,
        lossDetails: r.details,
        product: { productCode: product?.code, name: product?.name, status: product?.status },
        user: { name: usr?.name, surname: usr?.surname },
        lastSeenDepartment: {
            departmentCode: dept?.code,
            name: dept?.name,
            responsibleName: dept?.responsible_name
        }
    };
};

// mapeo reporte de mantenimiento
export const mapMaintenanceRowReportToResponse = (r: any): MaintenanceHistoryResponse => {
    const usr = Array.isArray(r.user) ? r.user[0] : r.user;

    return {
        repairDate: r.repair_date,
        repairDescription: r.repair_description,
        unusableDate: r.unusable_date,
        breakdownReason: r.breakdown_reason,
        cost: r.cost,
        user: { name: usr?.name, surname: usr?.surname }
    };
};

// mapeo reporte de traslados
export const mapMovementRowReportToResponse = (r: any): MovementHistoryResponse => {
    const usr = Array.isArray(r.user) ? r.user[0] : r.user;
    const origin = Array.isArray(r.origin) ? r.origin[0] : r.origin;
    const destination = Array.isArray(r.destination) ? r.destination[0] : r.destination;

    return {
        transferDate: r.date,
        reasonForMovement: r.reason,
        user: { name: usr?.name, surname: usr?.surname },
        originDepartment: { departmentCode: origin?.code, name: origin?.name },
        destinationDepartment: { departmentCode: destination?.code, name: destination?.name }
    };
};


// mapeo de logs
export const mapLogRowToResponse = (r: any): LogResponse => {
    const usr = Array.isArray(r.user) ? r.user[0] : r.user;

    return {
        id: r.id,
        action: r.action as ActionType,
        entityType: r.entity_type as EntityType,
        entityCode: r.entity_code,
        description: r.description,
        oldData: r.old_data,
        newData: r.new_data,
        timestamp: r.timestamp,
        user: usr ? { name: usr.name, surname: usr.surname } : null
    };
};
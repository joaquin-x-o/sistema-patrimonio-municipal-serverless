import { LogActionType, LogEntityType, type ActionType, type EntityType } from "../../types/log.type";

// entidades
export const entityTypeTranslation: Record<EntityType, string> = {
    [LogEntityType.PRODUCT]: "Producto",
    [LogEntityType.DEPARTMENT]: "Departamento",
    [LogEntityType.USER]: "Usuario",
    [LogEntityType.MOVEMENT_REPORT]: "Reporte de traslado",
    [LogEntityType.MAINTENANCE_REPORT]: "Reporte de mantenimiento",
    [LogEntityType.LOSS_REPORT]: "Reporte de extravío",
    [LogEntityType.RETIREMENT_REPORT]: "Reporte de baja",
    [LogEntityType.LOG]: "Auditoría"
};

// tipo de accion al auditar
export const actionTypeTranslation: Record<ActionType, string> = {
    [LogActionType.LOGIN]: "Inicio de sesión",
    [LogActionType.LOGOUT]: "Cierre de sesión",

    [LogActionType.CREATE_PRODUCT]: "Creación de producto",
    [LogActionType.EDIT_PRODUCT]: "Edición de producto",
    [LogActionType.REVIEW_PRODUCT]: "Revisión de producto",
    [LogActionType.APPROVE_PRODUCT_REVIEW]: "Aprobación de revisión",
    [LogActionType.CHECK_PRODUCT]: "Constatación de producto",
    [LogActionType.TRANSFER_PRODUCT]: "Traslado de producto",
    [LogActionType.MARK_PRODUCT_AS_UNUSABLE]: "Avería de producto",
    [LogActionType.REPAIR_PRODUCT]: "Reparación de producto",
    [LogActionType.MARK_PRODUCT_AS_LOST]: "Registro de pérdida",
    [LogActionType.MARK_PRODUCT_AS_FOUND]: "Registro de hallazgo",
    [LogActionType.RETIRE_PRODUCT]: "Baja de producto",
    [LogActionType.ENABLE_PRODUCT]: "Habilitación de producto",
    [LogActionType.DELETE_PRODUCT]: "Eliminación de producto",

    [LogActionType.CREATE_DEPARTMENT]: "Creación de departamento",
    [LogActionType.EDIT_DEPARTMENT]: "Edición de departamento",
    [LogActionType.ENABLE_DEPARTMENT]: "Habilitación de departamento",
    [LogActionType.DISABLE_DEPARTMENT]: "Deshabilitación de departamento",
    [LogActionType.DELETE_DEPARTMENT]: "Eliminación de departamento",

    [LogActionType.CREATE_USER]: "Creación de usuario",
    [LogActionType.EDIT_USER]: "Edición de usuario",
    [LogActionType.ENABLE_USER]: "Habilitación de usuario",
    [LogActionType.DISABLE_USER]: "Deshabilitación de usuario",
    [LogActionType.DELETE_USER]: "Eliminación de usuario"
};
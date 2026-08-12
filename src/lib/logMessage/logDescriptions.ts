import { LogActionType, type ActionType } from "../../types/log.type";

const LOG_DESCRIPTIONS: Record<ActionType, string> = {
    [LogActionType.LOGIN]: "El usuario inició sesión",
    [LogActionType.LOGOUT]: "El usuario cerró sesión",

    [LogActionType.CREATE_PRODUCT]: "Se creó el producto {code}",
    [LogActionType.EDIT_PRODUCT]: "Se editó el producto {code}",
    [LogActionType.REVIEW_PRODUCT]: "Se envió a revisión el producto {code}",
    [LogActionType.APPROVE_PRODUCT_REVIEW]: "Se aprobó la revisión del producto {code}",
    [LogActionType.CHECK_PRODUCT]: "Se realizó un la constatación del producto {code}",
    [LogActionType.TRANSFER_PRODUCT]: "Se trasladó el producto {code} {extra}",
    [LogActionType.MARK_PRODUCT_AS_UNUSABLE]: "Se marcó como inutilizable el producto {code}",
    [LogActionType.REPAIR_PRODUCT]: "Se registró la reparación del producto {code}",
    [LogActionType.MARK_PRODUCT_AS_LOST]: "Se registró la pérdida del producto {code}",
    [LogActionType.MARK_PRODUCT_AS_FOUND]: "Se registró el hallazgo del producto {code}",
    [LogActionType.RETIRE_PRODUCT]: "Se dio de baja el producto {code}",
    [LogActionType.ENABLE_PRODUCT]: "Se habilitó el producto {code}",
    [LogActionType.DELETE_PRODUCT]: "Se eliminó el producto {code}",

    [LogActionType.CREATE_DEPARTMENT]: "Se creó el departamento {code}",
    [LogActionType.EDIT_DEPARTMENT]: "Se editó el departamento {code}",
    [LogActionType.ENABLE_DEPARTMENT]: "Se habilitó el departamento {code}",
    [LogActionType.DISABLE_DEPARTMENT]: "Se deshabilitó el departamento {code}",
    [LogActionType.DELETE_DEPARTMENT]: "Se eliminó el departamento {code}",

    [LogActionType.CREATE_USER]: "Se creó el usuario {code}",
    [LogActionType.EDIT_USER]: "Se editó el usuario {code}",
    [LogActionType.ENABLE_USER]: "Se habilitó el usuario {code}",
    [LogActionType.DISABLE_USER]: "Se deshabilitó el usuario {code}",
    [LogActionType.DELETE_USER]: "Se eliminó el usuario {code}"
};

// arma la descripcion final reemplazando los placeholders {code} y {extra}
export const getLogDescription = (action: ActionType, code: string, extra?: string): string => {
    const template = LOG_DESCRIPTIONS[action];
    return template
        .replace("{code}", code)
        .replace("{extra}", extra ?? "");
};
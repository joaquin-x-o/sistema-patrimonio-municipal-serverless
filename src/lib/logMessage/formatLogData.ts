// utils/logs/formatLogData.ts
import { LogActionType, type ActionType } from "../../types/log.type";
import type { ProductCategory, ProductCondition, ProductStatus } from "../../types/product.type";
import { formatCalendarDateAR, formatDateAR } from "../../utils/date/formattedDate";
import { categoryTranslations, conditionTranslations, statusTranslations } from "../../utils/dictionaries/productDictionaries";

type JsonData = Record<string, unknown> | null;

// traduce un status de producto (ACTIVE -> Activo, etc.)
const translateStatus = (value: unknown): string => {
    const isKnownStatus = typeof value === "string" && value in statusTranslations;
    if (!isKnownStatus) return String(value);

    const translated = statusTranslations[value as ProductStatus];
    return translated;
};

const translateCondition = (value: unknown): string => {
    const isKnownCondition = typeof value === "string" && value in conditionTranslations;
    if (!isKnownCondition) return String(value);

    const translated = conditionTranslations[value as ProductCondition];
    return translated;
};

const translateCategory = (value: unknown): string => {
    const isKnownCondition = typeof value === "string" && value in categoryTranslations;
    if (!isKnownCondition) return String(value);

    const translated = categoryTranslations[value as ProductCategory];
    return translated;
};

// formato de respaldo para acciones que todavia no tienen un formateador propio
const defaultFormatter = (data: JsonData): string => {
    const isEmpty = !data || Object.keys(data).length === 0;
    if (isEmpty) return "-";

    const fields = Object.entries(data).map(([key, val]) => `${key}: ${val}`);
    const preview = fields.join(", ");

    return preview;
};

// PRODUCT ----------------------------------------------
const formatCreateProduct = (data: JsonData): string => {
    if (!data) return "-";

    const { product } = data as {
        product?: string;
    };

    const hasProduct = Boolean(product);

    if (hasProduct) {
        return product!;
    }

    return "-";
};

const formatEditProduct = (data: JsonData): string => {
    if (!data || Object.keys(data).length === 0) return "-";

    const fieldLabels: Record<string, string> = {
        name: "Nombre",
        description: "Descripción",
        observation: "Observación",
        productCode: "Código",
        category: "Categoría",
        physicalCondition: "Condición",
        registrationDate: "Fecha de alta",
        invoiceNumber: "Facturación",
        purchasePrice: "Valor",
        depreciation: "Depreciación"
    };

    const parts = Object.entries(data).map(([key, val]) => {
        const label = fieldLabels[key] ?? key;

        if (key === "category") return `${label}: ${translateCategory(val)}`;
        if (key === "physicalCondition") return `${label}: ${translateCondition(val)}`;
        if (key === "registrationDate") return `${label}: ${formatDateAR(val as string)}`;

        return `${label}: ${val}`;
    });

    return parts.join(", ");
};

const formatPendingReviewReason = (data: JsonData): string => {
    if (!data) return "-";

    const { pendingReviewReason } = data as {
        pendingReviewReason?: string;
    };

    const hasPendingReviewReason = Boolean(pendingReviewReason);

    if (hasPendingReviewReason) {
        return pendingReviewReason!;
    }

    return "-";
};

const formatMarkProductUnusable = (data: JsonData): string => {
    if (!data) return "-";

    const { unusableReason, physicalCondition, status } = data as {
        unusableReason?: string;
        physicalCondition?: string;
        status?: string;
    };

    const hasReason = Boolean(unusableReason);
    const hasCondition = Boolean(physicalCondition);
    const hasStatus = Boolean(status);

    const conditionText = hasCondition ? translateCondition(physicalCondition) : "";
    const statusText = hasStatus ? translateStatus(status) : "";

    const mainText = hasReason ? unusableReason : statusText;
    const hasMainText = Boolean(mainText);

    if (hasMainText && hasCondition) {
        return `${mainText} (${conditionText})`;
    }

    if (hasMainText) {
        return mainText as string;
    }

    if (hasCondition) {
        return conditionText;
    }

    return "-";
};


const formatRepairProduct = (data: JsonData): string => {
    if (!data) return "-";

    const { repairDescription, unusableReason, physicalCondition } = data as {
        repairDescription?: string;
        unusableReason?: string;
        physicalCondition?: string;
    };

    const mainText = repairDescription ?? unusableReason;

    const hasMainText = Boolean(mainText);
    const hasCondition = Boolean(physicalCondition);
    const conditionText = hasCondition ? translateCondition(physicalCondition) : "";

    if (hasMainText && hasCondition) {
        return `${mainText} (${conditionText})`;
    }

    if (hasMainText) {
        return mainText as string;
    }

    if (hasCondition) {
        return conditionText;
    }

    return "-";
};

const formatCheckProduct = (data: JsonData): string => {
    if (!data) return "-";

    const { lastCheckDate } = data as { lastCheckDate?: string | null };

    if (!lastCheckDate) return "-";

    return formatDateAR(lastCheckDate);
};

const formatMarkProductAsLost = (data: JsonData): string => {
    if (!data) return "-";

    const { lossDate } = data as {
        lossDate?: string;
    };

    const hasLossDate = Boolean(lossDate);

    if (hasLossDate) {
        return formatCalendarDateAR(lossDate!);
    }

    return "-";
};

const formatMarkProductAsFound = (data: JsonData): string => {
    if (!data) return "-";

    const { lossDate, foundDate } = data as {
        lossDate?: string;
        foundDate?: string;
    };

    const hasLossDate = Boolean(lossDate);
    const hasFoundDate = Boolean(foundDate);

    if (hasLossDate) {
        return formatCalendarDateAR(lossDate!);
    }

    if (hasFoundDate) {
        return formatDateAR(foundDate!);
    }

    return "-";
};

const formatTransferProduct = (data: JsonData): string => {
    if (!data) return "-";

    const { department } = data as {
        department?: string;
    };

    const hasDepartment = Boolean(department);

    if (hasDepartment) {
        return department!;
    }

    return "-";
};

const formatRetireProduct = (data: JsonData): string => {
    if (!data) return "-";

    const { retirementDate } = data as {
        retirementDate?: string;
    };

    const hasRetirementDate = Boolean(retirementDate);

    if (hasRetirementDate) {
        return formatDateAR(retirementDate!);
    }

    return "-";
};

const formatEnableProduct = (data: JsonData): string => {
    if (!data) return "-";

    const { retirementDate, enabledDate } = data as {
        retirementDate?: string;
        enabledDate?: string;
    };

    const hasRetirementDate = Boolean(retirementDate);
    const hasEnabledDate = Boolean(enabledDate);

    if (hasRetirementDate) {
        return formatDateAR(retirementDate!);
    }

    if (hasEnabledDate) {
        return formatDateAR(enabledDate!);
    }

    return "-";
};

const formatDeleteProduct = (data: JsonData): string => {
    if (!data) return "-";

    const { product } = data as {
        product?: string;
    };

    const hasProduct = Boolean(product);

    if (hasProduct) {
        return product!;
    }

    return "-";
};

// DEPARTMENT ----------------------------------------------

const formatCreateDepartment = (data: JsonData): string => {
    if (!data) return "-";

    const { department } = data as {
        department?: string;
    };

    const hasDepartment = Boolean(department);

    if (hasDepartment) {
        return department!;
    }

    return "-";
};

const formatEditDepartment = (data: JsonData): string => {
    if (!data || Object.keys(data).length === 0) return "-";

    const fieldLabels: Record<string, string> = {
        name: "Nombre",
        departmentCode: "Código"
    };

    const parts = Object.entries(data).map(([key, val]) => {
        const label = fieldLabels[key] ?? key;

        return `${label}: ${val}`;
    });

    return parts.join(", ");
};

const formatDepartmentStatusDate = (data: JsonData): string => {
    if (!data) return "-";

    const { updatedAt } = data as {
        updatedAt?: string;
    };

    const hasUpdatedAt = Boolean(updatedAt);

    if (hasUpdatedAt) {
        return formatDateAR(updatedAt!);
    }

    return "-";
};

const formatDeleteDepartment = (data: JsonData): string => {
    if (!data) return "-";

    const { department } = data as {
        department?: string;
    };

    const hasDepartment = Boolean(department);

    if (hasDepartment) {
        return department!;
    }

    return "-";
};

// USER --------------------------

const formatCreateUser = (data: JsonData): string => {
    if (!data) return "-";

    const { user } = data as {
        user?: string;
    };

    const hasUser = Boolean(user);

    if (hasUser) {
        return user!;
    }

    return "-";
};

const formatEditUser = (data: JsonData): string => {
    if (!data || Object.keys(data).length === 0) return "-";

    const fieldLabels: Record<string, string> = {
        username: "Usuario",
        name: "Nombre",
        email: "Email",
        role: "Rol",
        department: "Área"
    };

    const parts = Object.entries(data).map(([key, val]) => {
        const label = fieldLabels[key] ?? key;

        return `${label}: ${val}`;
    });

    return parts.join(", ");
};

const formatUserStatusDate = (data: JsonData): string => {
    if (!data) return "-";

    const { updatedAt } = data as {
        updatedAt?: string;
    };

    const hasUpdatedAt = Boolean(updatedAt);

    if (hasUpdatedAt) {
        return formatDateAR(updatedAt!);
    }

    return "-";
};

const formatDeleteUser = (data: JsonData): string => {
    if (!data) return "-";

    const { user } = data as {
        user?: string;
    };

    const hasUser = Boolean(user);

    if (hasUser) {
        return user!;
    }

    return "-";
};

// FORMATTER: cada accion define como se ve su "antes/despues"
const FORMATTERS: Partial<Record<ActionType, (data: JsonData) => string>> = {
    [LogActionType.CREATE_PRODUCT]: formatCreateProduct,
    [LogActionType.MARK_PRODUCT_AS_UNUSABLE]: formatMarkProductUnusable,
    [LogActionType.REPAIR_PRODUCT]: formatRepairProduct,
    [LogActionType.CHECK_PRODUCT]: formatCheckProduct,
    [LogActionType.EDIT_PRODUCT]: formatEditProduct,
    [LogActionType.REVIEW_PRODUCT]: formatPendingReviewReason,
    [LogActionType.APPROVE_PRODUCT_REVIEW]: formatPendingReviewReason,
    [LogActionType.MARK_PRODUCT_AS_LOST]: formatMarkProductAsLost,
    [LogActionType.MARK_PRODUCT_AS_FOUND]: formatMarkProductAsFound,
    [LogActionType.TRANSFER_PRODUCT]: formatTransferProduct,
    [LogActionType.RETIRE_PRODUCT]: formatRetireProduct,
    [LogActionType.ENABLE_PRODUCT]: formatEnableProduct,
    [LogActionType.DELETE_PRODUCT]: formatDeleteProduct,


    [LogActionType.CREATE_DEPARTMENT]: formatCreateDepartment,
    [LogActionType.EDIT_DEPARTMENT]: formatEditDepartment,
    [LogActionType.ENABLE_DEPARTMENT]: formatDepartmentStatusDate,
    [LogActionType.DISABLE_DEPARTMENT]: formatDepartmentStatusDate,
    [LogActionType.DELETE_DEPARTMENT]: formatDeleteDepartment,


    [LogActionType.CREATE_USER]: formatCreateUser,
    [LogActionType.EDIT_USER]: formatEditUser,
    [LogActionType.ENABLE_USER]: formatUserStatusDate,
    [LogActionType.DISABLE_USER]: formatUserStatusDate,
    [LogActionType.DELETE_USER]: formatDeleteUser,
};

export const formatLogData = (action: ActionType, data: JsonData): string => {
    const formatter = FORMATTERS[action];
    const hasSpecificFormatter = Boolean(formatter);

    if (hasSpecificFormatter) {
        return formatter!(data);
    }

    return defaultFormatter(data);
};
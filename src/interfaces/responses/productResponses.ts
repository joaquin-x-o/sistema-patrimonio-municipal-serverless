import { ProductCategory, ProductCondition, ProductStatus } from "../../types/product.type";


export interface ProductResponse {
    name: string;
    description: string;
    observation: string;

    productCode: number;

    category: ProductCategory;
    physicalCondition: ProductCondition;

    isLegacy: boolean;

    status: ProductStatus;
    statusUpdatedAt: string;

    reviewDaysPending: number;

    registrationDate: string | null;

    dateUnusable: string | null;
    unusableReason: string | null;

    retirementDate: string | null;

    needsCheckReview: boolean;
    lastCheckDate: string | null;
    pendingReviewReason: string | null;

    invoiceNumber: string | null;
    purchasePrice: number | null;
    depreciation: number | null;

    createdAt: string;
    updatedAt: string;

    department: { departmentCode: string; name: string; };
    user: { name: string; surname: string; };
}

export interface ProductShortResponse {
    name: string;
    productCode: number;
    category: ProductCategory;
    physicalCondition: ProductCondition;

    registrationDate: string | null;

    isLegacy: boolean;

    status: ProductStatus;
    statusUpdatedAt: string;

    reviewDaysPending: number;

    dateUnusable: string;
    unusableReason: string | null;

    needsCheckReview: boolean;
    lastCheckDate: string | null;

    pendingReviewReason: string | null;

    department: { departmentCode: string, name: string };
}

export interface ProductLightResponse {
    productCode: number;
    name: string;
}

// se le agrega el atributo daysPendingLabel para mostrarlo en la interfaz como un texto legible y no solo un numero (ej: "hace 3 dias")
export interface ReviewDisplayProduct extends ProductShortResponse {
    daysPendingLabel: string;
}

export interface ConditionCountResponse {
    physicalCondition: ProductCondition;
    count: number;
}

// nombre de las columnas que se exportan a excel 
export interface ProductExportRow {
  code: number;
  department: { code: string } | null;
  name: string;
  description: string | null;
  quantity: string;
  registration_date: string | null;
  physical_condition: ProductCondition | null;
  invoice_number: string | null;
  purchase_price: number | null;
  depreciation: number | null;
  observation: string | null;
  is_legacy: boolean;
}
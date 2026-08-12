import type { RetirementType } from "../../types/retirement.type";

export interface RetirementHistoryResponse {
    documentReference: string;
    retirementReason: string;
    retirementType: RetirementType;
    transactionDate: string;
    product: { productCode: number; name: string }
    user: { name: string; surname: string };
    department: { departmentCode: string; name: string; responsibleName: string };
}
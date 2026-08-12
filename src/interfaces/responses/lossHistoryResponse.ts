import type { LossType } from "../../types/lost.type";
import type { ProductStatus } from "../../types/product.type";

export interface LossHistoryResponse {
    complaintReference: string;
    lossDate: string;
    lossType: LossType;
    lossDetails: string;
    lastSeenDepartment: { departmentCode: string; name: string; responsibleName: string };
    product: { productCode: number; name: string, status: ProductStatus }
    user: { name: string; surname: string };
}


import type { ProductCategory, ProductCondition, ProductStatus } from "../../types/product.type";

export interface CreateProductDto {
    code: number;
    name: string;
    description: string;
    observation: string | null;
    registration_date?: string;
    physical_condition: ProductCondition;
    category: ProductCategory;
    is_legacy: boolean;
    last_check_date: string;
    status: ProductStatus;
    status_updated_at: string;
    department_id: number;
    user_id: string;
}

export interface UpdateProductDto {
    code?: number;
    name?: string;
    description?: string;
    observation?: string | null;
    registration_date?: string;
    physical_condition?: ProductCondition;
    category?: ProductCategory;
    updated_at: string;
}

export interface UnusableProductDto {
    unusableReason: string,
    physicalCondition?: ProductCondition
}



// NOTA: cuando se utilizan rpc functions, el nombre de cada clave debe ser identica a la definida en la db

export interface TransferProductDto {
    p_product_id: number;
    p_destination_department_id: number;
    p_date: string;
    p_reason: string;
    p_user_id: string;
}

export interface RepairProductDto {
    p_product_id: number;
    p_physical_condition: string;
    p_repair_description: string;
    p_cost: number | null;
    p_repair_date: string;
    p_user_id: string;
}


export interface LostProductDto {
    p_product_id: number;
    p_complaint_reference: string;
    p_date: string;
    p_type: string;
    p_details: string;
    p_user_id: string;
}

export interface RetireProductDto {
    p_product_id: number;
    p_doc_reference: string;
    p_reason: string;
    p_date: string;
    p_type: string;
    p_user_id: string;
}
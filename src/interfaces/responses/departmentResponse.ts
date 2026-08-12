export interface DepartmentResponse {
    departmentCode: string;
    name: string;
    responsibleName: string;
    isActive: boolean;
    registrationDate: string | null;
    productCount?: number;
    percentage?: number;
    createdAt: string;
    updatedAt: string;
}

export interface DepartmentLightResponse {
    name: string;
    code: string;
}

export interface DepartmentWithCountRow {
    code: string;
    name: string;
    responsible_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    product_count: number;
}
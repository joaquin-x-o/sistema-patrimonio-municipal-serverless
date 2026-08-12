import type { DepartmentLightResponse, DepartmentResponse } from "../../../interfaces/responses/departmentResponse";
import type { DepartmentProductCountStats } from "../../../interfaces/responses/departmentProductCountStats";

export const mapDepartmentRowToResponse = (d: any): DepartmentResponse => ({
    departmentCode: d.code,
    name: d.name,
    responsibleName: d.responsible_name,
    isActive: d.is_active,
    registrationDate: d.created_at,
    createdAt: d.created_at,
    updatedAt: d.updated_at
});

export const mapDepartmentWithCountRowToResponse = (d: any, totalProducts: number): DepartmentResponse => {
    const productCount = Number(d.product_count);

    const productPercentage = totalProducts > 0 ? Math.round((productCount / totalProducts) * 100 * 10) / 10 : 0;
    return {
        departmentCode: d.code,
        name: d.name,
        responsibleName: d.responsible_name,
        isActive: d.is_active,
        registrationDate: d.created_at,
        productCount,
        percentage: productPercentage,
        createdAt: d.created_at,
        updatedAt: d.updated_at
    };
};

export const mapDepartmentRowToLightResponse = (d: any): DepartmentLightResponse => ({
    name: d.name,
    code: d.code,
});


export const mapDepartmentRowToProductCountStats = (d: any): DepartmentProductCountStats => ({
    departmentCode: d.code,
    name: d.name,
    productCount: Number(d.product_count)
});
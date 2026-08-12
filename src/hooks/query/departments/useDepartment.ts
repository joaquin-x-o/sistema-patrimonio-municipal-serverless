import { getDepartmentByCode } from "../../../services/departments/department.service";
import { getProducts } from "../../../services/products/product.service";
import type { DepartmentResponse } from "../../../interfaces/responses/departmentResponse";
import type { ProductShortResponse } from "../../../interfaces/responses/productResponses";
import type { ProductsParams } from "../../../interfaces/params/productParams";
import { useState, useEffect } from "react";
import { usePaginatedQuery } from "../../common/usePaginatedQuery";

export const useDepartment = (params: ProductsParams) => {
    const { departmentCode, page = 1, limit = 10, category, condition, status, dateMode, dateValue } = params;
    const [department, setDepartment] = useState<DepartmentResponse | null>(null);

    const action = async () => {
        if (!departmentCode) return { data: [], total: 0, totalPages: 0 };

        const [deptData, productsData] = await Promise.all([
            getDepartmentByCode(departmentCode),
            getProducts({ departmentCode, page, limit, category, condition, status, dateMode, dateValue })
        ]);

        setDepartment({
            ...deptData,
            productCount: productsData.total
        });

        return productsData;
    };

    const {
        data: products,
        total,
        totalPages,
        loading,
        error,
        refetch
    } = usePaginatedQuery<ProductShortResponse>(
        action,
        { page, limit },
        [departmentCode, category, condition, status, dateMode, dateValue]
    );

    useEffect(() => {
        if (!departmentCode || error) {
            setDepartment(null);
        }
    }, [departmentCode, error]);

    return {
        department,
        products,
        total,
        totalPages,
        loading,
        error,
        refetch
    };
};
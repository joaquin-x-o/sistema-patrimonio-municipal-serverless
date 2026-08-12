import { getDepartments } from "../../../services/departments/department.service";
import type { PaginationParams } from "../../../interfaces/params/paginationParams";
import type { DepartmentResponse } from "../../../interfaces/responses/departmentResponse";
import { usePaginatedQuery } from "../../common/usePaginatedQuery";

export const useDepartments = (params: PaginationParams = {}) => {
    const { page = 1, limit = 10 } = params;

    const action = async () => {
        return await getDepartments(params);
    };

    const {
        data,
        total,
        totalPages,
        currentPage,
        loading,
        error,
        refetch
    } = usePaginatedQuery<DepartmentResponse>(
        action,
        { page, limit },
        []
    );

    return {
        data,
        total,
        currentPage,
        totalPages,
        loading,
        error,
        refetch
    };
};
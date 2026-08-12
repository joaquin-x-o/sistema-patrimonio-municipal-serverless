import { getDepartmentProductCountStats } from "../../../services/departments/department.service";
import type { DepartmentProductCountStats } from "../../../interfaces/responses/departmentProductCountStats";
import { useQuery } from "../../common/useQuery";

export const useDepartmentProductCountStats = (limit: number) => {
    async function action() {
        return await getDepartmentProductCountStats(limit);
    }

    const { data, loading, error, refetch } = useQuery<DepartmentProductCountStats[]>(
        action,
        [limit]
    );

    return {
        data: data ?? [],
        loading,
        error,
        refetch
    };
};
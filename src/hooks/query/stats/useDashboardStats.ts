import { getTotalProductsToReview } from "../../../services/products/product.service";
import { getDepartmentProductCountStats } from "../../../services/departments/department.service";
import type { DepartmentProductCountStats } from "../../../interfaces/responses/departmentProductCountStats";
import { getTotalRetirementsByYear } from "../../../services/retirementHistory/retirementHistory.service";
import { useQuery } from "../../common/useQuery";

interface DashboardStats {
    totalProductsToReview: number;
    totalRetirements: number;
    departmentStats: DepartmentProductCountStats[];
}

async function action(): Promise<DashboardStats> {
    const currentYear = new Date().getFullYear();

    const [reviewData, retirementData, deptData] = await Promise.all([
        getTotalProductsToReview(),
        getTotalRetirementsByYear(currentYear),
        getDepartmentProductCountStats(3)
    ]);

    return {
        totalProductsToReview: reviewData.total,
        totalRetirements: retirementData,
        departmentStats: deptData
    };
}

export const useDashboardStats = () => {
    const { data, loading, error, refetch } = useQuery<DashboardStats>(
        action,
        [],
        { errorMessage: "Error al cargar las estadísticas del dashboard." }
    );

    return {
        data,
        loading,
        error,
        refetch
    };
};
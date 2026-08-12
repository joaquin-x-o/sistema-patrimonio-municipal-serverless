import { checkProductHasMaintenance, checkProductHasMovements } from "../../../services/products/product.service";
import { useQuery } from "../../common/useQuery";

interface HistoryMeta {
    hasMaintenance: boolean;
    hasMovements: boolean;
}

export const useProductHistoryMeta = (productCode: string | undefined) => {
    async function action() {
        if (!productCode) return { hasMaintenance: false, hasMovements: false };

        const [maintenanceCheck, movementsCheck] = await Promise.all([
            checkProductHasMaintenance(productCode),
            checkProductHasMovements(productCode)
        ]);

        return {
            hasMaintenance: maintenanceCheck,
            hasMovements: movementsCheck
        };
    }

    const { data, loading, error, refetch } = useQuery<HistoryMeta>(
        action,
        [productCode],
        { enabled: !!productCode }
    );

    return {
        hasMaintenance: data?.hasMaintenance ?? false,
        hasMovements: data?.hasMovements ?? false,
        loading,
        error,
        refetch
    };
};
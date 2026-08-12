import { getReviewCounts, getProductsByStatus } from "../../../services/products/product.service";
import type { ProductFilterTab } from "../../../types/product.type";
import { useQuery } from "../../common/useQuery";

export const useReviewProducts = (activeTab: ProductFilterTab) => {
    async function action() {
        const [products, counts] = await Promise.all([
            getProductsByStatus(activeTab),
            getReviewCounts()
        ]);
        return { products, counts };
    }

    const { data, loading, error, refetch } = useQuery(
        action,
        [activeTab]);

    return {
        products: data?.products ?? [],
        counts: data?.counts ?? null,
        loading,
        error,
        refetch
    };
};
import { getProductCountByCondition } from "../../../services/products/product.service";
import { useQuery } from "../../common/useQuery";

function action() {
    return getProductCountByCondition();
}

export const useProductCountByCondition = () => {
    const { data, loading, error } = useQuery(
        action,
        [],
        { errorMessage: "Error al cargar las estadísticas por condición." }
    );

    return { data: data ?? [], loading, error };
};
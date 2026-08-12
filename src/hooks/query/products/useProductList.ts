import { getProductList } from "../../../services/products/product.service";
import { useQuery } from "../../common/useQuery";

function action() {
    return getProductList();
}

export const useProductList = () => {
    const { data, loading } = useQuery(
        action,
        [],
        { errorMessage: "Error al cargar el listado de productos." }
    );

    return { data: data ?? [], loading };
};
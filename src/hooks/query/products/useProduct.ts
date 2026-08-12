import { getProductByCode } from "../../../services/products/product.service";
import { useQuery } from "../../common/useQuery";

export const useProduct = (productCode: string | undefined) => {
    function action() {
        return getProductByCode(productCode);
    }

    return useQuery(
        action,
        [productCode],
        { enabled: !!productCode, errorMessage: "Error al cargar el producto." }
    );
};
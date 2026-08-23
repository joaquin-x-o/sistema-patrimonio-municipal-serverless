import type { RetireProductRequest } from "../../../../schemas/product.schemas";
import { retireProduct } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export const useRetireProduct = () => {

    function action(productCode: string, request: RetireProductRequest) {
        return retireProduct(productCode, request);
    }

    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error desconocido al procesar la baja."
    );

    return {
        retireProduct: execute,
        loading,
        error,
        setError
    };
};
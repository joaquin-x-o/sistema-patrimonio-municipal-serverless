import type { UpdateProductRequest } from "../../../../schemas/product.schemas";
import { updateProduct } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(productCode: number, request: UpdateProductRequest) {
    return updateProduct(productCode, request);
}

export const useUpdateProduct = () => {
    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error desconocido al actualizar el producto."
    );

    return {
        updateProduct: execute,
        loading,
        error,
        setError
    };
};
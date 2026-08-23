import type { CreateProductRequest } from "../../../../schemas/product.schemas";
import { createProduct } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(data: CreateProductRequest) {
    return createProduct(data);
}

export const useCreateProduct = () => {
    const { execute, loading, error, setError } = useAsyncMutation(action, "Error al intentar crear el producto."
    );

    return {
        createNewProduct: execute,
        loading,
        error,
        setError
    };
};
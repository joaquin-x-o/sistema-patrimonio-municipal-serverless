import { deleteProduct } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(userId: string, productId: number) {
    return deleteProduct(userId!, productId);
}

export const useDeleteProduct = () => {
    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error al intentar eliminar el producto."
    );

    return {
        deleteProduct: execute,
        loading,
        error,
        setError
    };
};
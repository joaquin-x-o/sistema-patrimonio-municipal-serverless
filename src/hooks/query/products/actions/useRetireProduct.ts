import { useAuth } from "../../../auth/useAuth";
import type { RetireProductRequest } from "../../../../schemas/product.schemas";
import { retireProduct } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export const useRetireProduct = () => {
    const { user } = useAuth();

    function action(productCode: string, request: RetireProductRequest) {
        if (!user) {
            throw new Error("No hay un usuario autenticado para procesar la baja.");
        }
        return retireProduct(productCode, user.id, request);
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
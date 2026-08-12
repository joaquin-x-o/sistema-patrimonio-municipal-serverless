import type { TransferProductRequest } from "../../../../schemas/product.schemas";
import { transferProduct } from "../../../../services/products/product.service";
import { useAuth } from "../../../auth/useAuth";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export const useTransferProduct = () => {
    const { user } = useAuth();

    function action(productCode: number, request: TransferProductRequest) {
        if (!user) {
            throw new Error("No hay un usuario autenticado para realizar esta acción.");
        }

        const codeString = String(productCode);
        return transferProduct(codeString, user.id, request);
    }

    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error desconocido al transferir el producto."
    );

    return {
        transferProduct: execute,
        loading,
        error,
        setError
    };
};
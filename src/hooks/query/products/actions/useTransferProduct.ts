import type { TransferProductRequest } from "../../../../schemas/product.schemas";
import { transferProduct } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export const useTransferProduct = () => {

    function action(productCode: number, request: TransferProductRequest) {
        const codeString = String(productCode);
        return transferProduct(codeString, request);
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
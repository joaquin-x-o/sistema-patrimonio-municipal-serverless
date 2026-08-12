import type { MarkProductUnusableRequest } from "../../../../schemas/product.schemas";
import { markAsUnusable } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(userId: string, productCode: string, request: MarkProductUnusableRequest) {
    return markAsUnusable(userId, productCode, request);
}

export const useMarkProductUnusable = () => {
    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error al marcar en desuso."
    );

    return {
        markUnusable: execute,
        loading,
        error,
        setError
    };
};
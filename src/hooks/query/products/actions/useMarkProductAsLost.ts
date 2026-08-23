import type { LostProductRequest } from "../../../../schemas/product.schemas";
import { markProductAsLost } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export const useLostProduct = () => {

    function action(productCode: string, request: LostProductRequest) {
        return markProductAsLost(productCode, request);
    }

    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error desconocido al reportar pérdida."
    );

    return {
        markAsLost: execute,
        loading,
        error,
        setError
    };
};
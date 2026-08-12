import type { ReviewProductRequest } from "../../../../schemas/product.schemas";
import { reviewProduct } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(userId: string, productCode: string, request: ReviewProductRequest) {
    return reviewProduct(userId, productCode, request);
}

export const useReviewProduct = () => {
    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error al enviar a revisión."
    );

    return {
        reviewProduct: execute,
        loading,
        error,
        setError
    };
};
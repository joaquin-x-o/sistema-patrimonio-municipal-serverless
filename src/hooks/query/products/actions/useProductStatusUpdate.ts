import { approveReview, checkProductExistence, enableProduct, markProductAsFound } from "../../../../services/products/product.service";
import { useAuth } from "../../../auth/useAuth";
import { useMappedActions } from "../../../common/useMappedActions";

export type ProductActionKey = "approveReview" | "markFound" | "enableProduct" | "checkExistence";

export const useProductActions = () => {
    const { user } = useAuth();

    const productActions: Record<ProductActionKey, (code: string) => Promise<any> | any> = {
        approveReview: (code: string) => approveReview(user!.id, code),
        markFound: (code: string) => markProductAsFound(user!.id, code),
        enableProduct: (code: string) => enableProduct(user!.id, code),
        checkExistence: (code: string) => checkProductExistence(user!.id, code)
    };

    const { dispatchAction, loading, error, setError } = useMappedActions(
        productActions,
        "Error al ejecutar la acción del producto."
    );

    return { changeStatus: dispatchAction, loading, error, setError };
};
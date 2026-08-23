import { approveReview, checkProductExistence, enableProduct, markProductAsFound } from "../../../../services/products/product.service";
import { useMappedActions } from "../../../common/useMappedActions";

export type ProductActionKey = "approveReview" | "markFound" | "enableProduct" | "checkExistence";

export const useProductActions = () => {

    const productActions: Record<ProductActionKey, (code: string) => Promise<any> | any> = {
        approveReview: (code: string) => approveReview(code),
        markFound: (code: string) => markProductAsFound(code),
        enableProduct: (code: string) => enableProduct(code),
        checkExistence: (code: string) => checkProductExistence(code)
    };

    const { dispatchAction, loading, error, setError } = useMappedActions(
        productActions,
        "Error al ejecutar la acción del producto."
    );

    return { changeStatus: dispatchAction, loading, error, setError };
};
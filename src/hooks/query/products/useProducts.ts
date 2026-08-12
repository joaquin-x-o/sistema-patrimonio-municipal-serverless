import type { ProductsParams } from "../../../interfaces/params/productParams";
import { getProducts } from "../../../services/products/product.service";
import { usePaginatedQuery } from "../../common/usePaginatedQuery";

export const useProducts = (params: ProductsParams = {}) => {
    function action() {
        return getProducts(params);
    }

    return usePaginatedQuery(
        action,
        params,
        [params.category, params.condition, params.status]
    );
};
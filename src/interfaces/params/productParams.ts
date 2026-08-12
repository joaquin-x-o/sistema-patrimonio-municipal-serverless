import type { DateFilterOptions } from "../../types/dataFilterOptions.type";
import type { ProductCategory, ProductCondition, ProductStatus } from "../../types/product.type";

export interface ProductsParams {
    category?: ProductCategory | "";
    condition?: ProductCondition | "";
    status?: ProductStatus | "";
    dateMode?: DateFilterOptions;
    dateValue?: string;
    departmentCode?: string;
    page?: number;
    limit?: number;
}
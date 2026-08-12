import { searchProductsLight } from "../../../services/products/product.service";
import type { ProductLightResponse } from "../../../interfaces/responses/productResponses";
import { useState, useEffect } from "react";
import { useQuery } from "../../common/useQuery";

export const useProductSearch = (query: string, debounceMs = 300) => {
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, debounceMs]);

    async function action() {
        if (!debouncedQuery.trim()) return [];
        return await searchProductsLight(debouncedQuery);
    }

    const { data, loading, error, refetch } = useQuery<ProductLightResponse[]>(
        action,
        [debouncedQuery],
        { enabled: debouncedQuery.trim().length > 0 }
    );

    return {
        results: debouncedQuery.trim() ? (data ?? []) : [],
        loading: query !== debouncedQuery ? true : loading,
        error,
        refetch
    };
};
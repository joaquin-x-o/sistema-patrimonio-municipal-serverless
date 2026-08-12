import { useState, useEffect, useCallback } from "react";

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    totalPages: number;
}

interface PaginatedParams {
    page?: number;
    limit?: number;
    [key: string]: any;
}

// custom hook para ejecutar consultas GET paginadas
export const usePaginatedQuery = <T>(
    queryFn: () => Promise<PaginatedResponse<T>>,
    params: PaginatedParams,
    dependencies: any[] = []
) => {
    const [data, setData] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refetch = useCallback(() => setRefreshTrigger((prev) => prev + 1), []);

    useEffect(() => {
        const execute = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await queryFn();
                setData(result.data ?? []);
                setTotal(result.total ?? 0);
                setTotalPages(result.totalPages ?? 0);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar el listado.");
            } finally {
                setLoading(false);
            }
        };

        execute();
    }, [params.page, params.limit, ...dependencies, refreshTrigger]);

    return {
        data,
        total,
        totalPages,
        currentPage: params.page ?? 1,
        loading,
        error,
        refetch
    };
};
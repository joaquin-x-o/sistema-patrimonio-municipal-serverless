import { useState, useEffect, useCallback } from "react";

interface QueryOptions {
    errorMessage?: string;
    enabled?: boolean;
}

// custom hook para ejecutar consultas GET
export const useQuery = <T>(
    action: () => Promise<T>,
    dependencies: any[] = [],
    options: QueryOptions = {}
) => {
    const { errorMessage = "Error al cargar los datos.", enabled = true } = options;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refetch = useCallback(() => setRefreshTrigger((prev) => prev + 1), []);

    useEffect(() => {
        if (!enabled) return;

        const execute = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await action();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : errorMessage);
            } finally {
                setLoading(false);
            }
        };

        execute();
    }, [...dependencies, refreshTrigger, enabled]);

    return { data, loading, error, refetch };
};
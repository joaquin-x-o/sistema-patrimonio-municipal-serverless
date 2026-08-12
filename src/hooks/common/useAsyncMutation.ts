import { useState, useCallback } from "react";

// custom hook para ejecutar endpoints de modificacion
export const useAsyncMutation = <Args extends any[], Response>(action: (...args: Args) => Promise<Response>, defaultErrorMessage = "Error desconocido"
) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (...args: Args): Promise<Response> => {
        setLoading(true);
        setError(null);

        try {
            // accion que se ejecuta
            return await action(...args);
        } catch (err) {
            const message = err instanceof Error ? err.message : defaultErrorMessage;
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [action, defaultErrorMessage]);

    return { execute, loading, error, setError };
};
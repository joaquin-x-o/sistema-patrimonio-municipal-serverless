import { useState } from "react";

interface FieldErrorMatch {
    message: string;
    field: string;
}

interface SubmitHandlerOptions<T> {
    action: () => Promise<T>;
    onSuccess: (result: T) => void;
    fieldErrors?: FieldErrorMatch[];
    setFormFieldError?: (field: string, error: { type: string; message: string }) => void;
    fallbackMessage?: string;
    logLabel: string;
}

// maneja el submit de los formularios: loading, error genérico, error de campo especifico y logueo de errores
export const useFormSubmitHandler = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async <T,>({
        action,
        onSuccess,
        fieldErrors = [],
        setFormFieldError,
        fallbackMessage = "Ocurrió un error inesperado. Intente nuevamente.",
        logLabel
    }: SubmitHandlerOptions<T>) => {
        setError(null);
        setLoading(true);

        try {
            // ejecucion de la consulta
            const result = await action();
            onSuccess(result);
        } catch (err: any) {
            // seteo de errores
            const message = err?.message ?? fallbackMessage;

            console.error(`Error al ${logLabel}:`, err);

            const matchedField = fieldErrors.find(fe => fe.message === message);

            if (matchedField && setFormFieldError) {
                setFormFieldError(matchedField.field, { type: "manual", message });
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return { submit, error, setError, loading };
};
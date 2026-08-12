import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type WizardStep = "SEARCH_CODE" | "EDIT_FORM" | "SUCCESS";

interface Props<T> {
    stateKey: string; // clave para extraer el codigo desde location.state 
    fetchEntity: (code: string) => Promise<T> | T; // funcion que consulta a la api o el mock
}

// hook personalizado para manejar la logica de un wizard de busqueda + formulario + resultado exitoso 
export function useWizardFlow<T>({ stateKey, fetchEntity }: Props<T>) {
    const navigate = useNavigate();
    const location = useLocation();

    const [currentStep, setCurrentStep] = useState<WizardStep>("SEARCH_CODE");
    const [entityData, setEntityData] = useState<T | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    // manejador para el submit del formulario de busqueda 
    const handleSearchSubmit = useCallback(async (code: string) => {
        setApiError(null);
        try {
            const data = await fetchEntity(code);
            setEntityData(data);
            setCurrentStep("EDIT_FORM");
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('invalid input syntax for type bigint: "NaN"')) {
                    setApiError("El código ingresado no es válido. Por favor, intente de nuevo.");
                } else {
                    setApiError(error.message);
                }
            } else {
                setApiError("Ocurrió un error al buscar el registro.");
            }
        }
    }, [fetchEntity]);


    // si el wizard recibe un codigo desde location.state (ej: viene desde la pagina de detalles), se redirige directamente al formulario de edicion
    useEffect(() => {
        const codeFromLocation = location.state?.[stateKey];
        if (codeFromLocation) {
            handleSearchSubmit(codeFromLocation);
        }
    }, [handleSearchSubmit, stateKey]);

    // manejadores para el boton de de cancelar 
    const handleCancelSearch = () => {
        navigate(-1);
    };

    // manejador para el boton de volver desde el formulario, si se accedio al wizard desde otra pagina se vuelve a esa pagina. Caso contrario se vuelve al paso de busqueda
    const handleBackFromForm = () => {
        const codeFromLocation = location.state?.[stateKey];
        if (codeFromLocation) {
            navigate(-1);
        } else {
            setCurrentStep("SEARCH_CODE");
        }
    };

    // manejador para el exito del formulario, avanza al paso de exito
    const handleSuccess = () => {
        setCurrentStep("SUCCESS");
    };

    return {
        currentStep,
        entityData,
        apiError,
        handleSearchSubmit,
        handleCancelSearch,
        handleBackFromForm,
        handleSuccess
    };
}
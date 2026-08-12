import { useAsyncMutation } from "./useAsyncMutation";

// tipo genérico para el mapa de funciones
// clave: funcionAsociada()

// NOTA: todas las funciones del mapa deben aceptar la misma cantidad y tipo de parámetros.
type ActionMap<TKey extends string, TArgs extends any[]> = {
    [K in TKey]: (...args: TArgs) => Promise<any> | any;
};

// custom hook para ejecutar acciones de entidades que requieran solo cambios de estado, del tipo habilitar/deshabilitar
export const useMappedActions = <TKey extends string, TArgs extends any[]>(
    actions: ActionMap<TKey, TArgs>,
    errorMessage: string
) => {

    // recibe una clave y busca la accion asociada
    function action(actionKey: TKey, ...args: TArgs) {
        const selectedAction = actions[actionKey];

        if (!selectedAction) {
            throw new Error(`Acción "${actionKey}" no válida.`);
        }
        return selectedAction(...args);
    }

    // la funcion es enviada al custom hook encargada de ejecutar la accion
    const { execute, loading, error, setError } = useAsyncMutation(action, errorMessage);

    return {
        dispatchAction: execute,
        loading,
        error,
        setError
    };
};
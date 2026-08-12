
// controla el texto de los botones de los formularios cuando se realiza una peticion segun el estado loading que recibe como parametro
export const getSubmitText = (
    loading: boolean,
    verb: string,
    complement?: string,

): string => {

    // complemento opcional para acciones con texto adicional, ej: "Marcar" + "producto como extraviado" 
    const suffix = complement ? ` ${complement}` : "";

    if (!loading) return `${verb}${suffix}`;

    // "Eliminar" -> "Eliminando", "Crear" -> "Creando", "Actualizar" -> "Actualizando"
    const gerundVerb = verb.endsWith("ar")
        ? verb.slice(0, -2) + "ando"
        : verb.slice(0, -2) + "iendo";

    return `${gerundVerb}${suffix}...`;
};
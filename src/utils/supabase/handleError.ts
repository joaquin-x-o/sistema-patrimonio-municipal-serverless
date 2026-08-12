
// manejo de error cuando no se encuentran registros en la db
export const handleSingleError = (error: any, entityName = "elemento") => {
    if (error.code === 'PGRST116') throw new Error(`No se encontró el ${entityName}.`);
    throw new Error(error.message);
};
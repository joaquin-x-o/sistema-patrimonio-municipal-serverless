// convierte un objeto de traducciones en un array de opciones para filtros, con un label opcional para "todos"
export function createFilterOptions<T extends string>(translations: Record<T, string>, allLabel?: string) {

    // conversion de objeto a array de opciones
    const options = Object.entries(translations).map(([value, label]) => ({
        value: value as T,
        label: label as string
    }));

    // si se proporciona un label para "todos", se agrega al inicio del array de opciones
    const allFilterOptions = allLabel ? [{ value: "" as T, label: allLabel }, ...options] : options;

    return allFilterOptions
}
type EntityType = "usuario" | "area";

// determina la ruta para habilitar o deshabilitar una entidad dependiendo de su estado actual
export function getStatusRoute(status: boolean, entity: EntityType): string {

    let route = status ? `/${entity}/deshabilitar` : `/${entity}/habilitar`;

    return route
}

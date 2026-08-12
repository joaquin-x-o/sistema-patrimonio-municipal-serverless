// pasar username a minusculas y eliminar espacios accidentales
export const normalizeUsername = (username: string) => {
    const normalizedUsername = username.trim().toLowerCase();

    return normalizedUsername
}
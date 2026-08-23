// formatear precio a formato de moneda local
export const formatPrice = (
    value: number | string | null | undefined
): string => {
    if (value === null || value === undefined || value === "") {
        return "No especificado";
    }

    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
        return "No especificado";
    }

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numericValue);
};

// parsear precio de formato de moneda local a valor numerico usado en la base de datos
export const parseNumericInput = (value: string | null | undefined): number | null => {
    if (!value || value.trim() === '') return null;
    
    const cleaned = value.replace(/\./g, '').replace(',', '.');
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
};
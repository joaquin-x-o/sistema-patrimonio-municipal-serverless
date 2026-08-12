import { getDayDifference } from "../date/getDaydifference";

// determina si un producto debe ser constatado según su última fecha de revisión
export function shouldBeChecked(lastCheckDate: string | null): boolean {
    if (!lastCheckDate) return true;

    const dayDifference = getDayDifference(lastCheckDate);

    const needsCheck = dayDifference >= 180; // si han pasado 180 días (6 meses) o más desde la última revisión, se necesita constatar el producto

    return needsCheck;
}
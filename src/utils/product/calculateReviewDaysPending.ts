// utils/product/calculateReviewDaysPending.ts
import { ProductStatus } from "../../types/product.type";
import { getDayDifference } from "../date/getDaydifference";

// calcula los días pendientes de revisión para un producto según su estado y la fecha de actualización del estado
export function calculateReviewDaysPending(status: ProductStatus, statusDate: string | null, needsCheckReview: boolean): number {
    if (!statusDate) return 0;

    if (status === ProductStatus.LOST || status === ProductStatus.IN_REVIEW || status === ProductStatus.UNUSABLE || needsCheckReview) {
        const daysPending = Math.max(0, getDayDifference(statusDate));
        return daysPending;
    }

    return 0;
}
import type { ProductShortResponse, ReviewDisplayProduct } from "../../interfaces/responses/productResponses";
import type { ProductFilterTab } from "../../types/product.type";
import { getDayDifference } from "../../utils/date/getDaydifference";
import { getComparableDate } from "../../utils/date/getComparableDate";


export const mapReviewProducts = (products: ProductShortResponse[], status: ProductFilterTab): ReviewDisplayProduct[] => {
    const productsToReview = products.map(p => ({
        ...p,
        daysPendingLabel: status === 'CHECK_REVIEW'
            ? (!p.lastCheckDate ? "Nunca constatado" : `${getDayDifference(p.lastCheckDate)} días`)
            : `${p.reviewDaysPending} días`,
    }))
        .sort((a, b) => {
            if (status !== 'CHECK_REVIEW') return b.reviewDaysPending - a.reviewDaysPending;
            if (!a.lastCheckDate) return -1;
            if (!b.lastCheckDate) return 1;
            return getComparableDate(a.lastCheckDate) - getComparableDate(b.lastCheckDate);
        });

    return productsToReview
};
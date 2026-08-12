import type { ConditionCountResponse, ProductLightResponse, ProductResponse, ProductShortResponse } from "../../../interfaces/responses/productResponses";
import { calculateReviewDaysPending } from "../../../utils/product/calculateReviewDaysPending";
import { shouldBeChecked } from "../../../utils/product/shouldBeChecked";


// mapear datos a ProductResponse
export const mapProductRowToFullResponse = (data: any): ProductResponse => {
    const dept = Array.isArray(data.department)
        ? data.department[0]
        : data.department;

    const usr = Array.isArray(data.user)
        ? data.user[0]
        : data.user;

    const normalizedLastCheckDate = data.last_check_date?.split('T')[0] ?? null;
    const normalizedStatusDate = data.status_updated_at?.split('T')[0] ?? null;

    const needsCheckReview = shouldBeChecked(normalizedLastCheckDate);

    const reviewDaysPending = calculateReviewDaysPending(
        data.status,
        normalizedStatusDate,
        needsCheckReview
    );

    return {
        productCode: data.code,
        name: data.name,
        description: data.description,
        observation: data.observation,
        category: data.category,
        physicalCondition: data.physical_condition,
        isLegacy: data.is_legacy,
        status: data.status,
        statusUpdatedAt: data.status_updated_at,
        registrationDate: data.registration_date,
        dateUnusable: data.date_unusable,
        unusableReason: data.unusable_reason,
        retirementDate: data.retirement_date,
        lastCheckDate: data.last_check_date,
        pendingReviewReason: data.pending_review_reason,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        reviewDaysPending,
        needsCheckReview,
        department: {
            departmentCode: dept?.code,
            name: dept?.name
        },
        user: {
            name: usr?.name,
            surname: usr?.surname
        }
    };
};

// mapear datos a ProductShortResponse
export const mapProductRowToShortResponse = (p: any): ProductShortResponse => {
    const dept = Array.isArray(p.department) ? p.department[0] : p.department;


    const normalizedLastCheckDate = p.last_check_date?.split('T')[0] ?? null;
    const normalizedStatusDate = p.status_updated_at?.split('T')[0] ?? null;

    const needsCheckReview = shouldBeChecked(normalizedLastCheckDate);
    const reviewDaysPending = calculateReviewDaysPending(
        p.status,
        normalizedStatusDate,
        needsCheckReview
    );

    return {
        productCode: p.code,
        name: p.name,
        category: p.category,
        physicalCondition: p.physical_condition,
        registrationDate: p.registration_date,
        isLegacy: p.is_legacy,
        status: p.status,
        statusUpdatedAt: p.status_updated_at,
        dateUnusable: p.date_unusable,
        unusableReason: p.unusable_reason,
        lastCheckDate: p.last_check_date,
        pendingReviewReason: p.pending_review_reason,
        reviewDaysPending,
        needsCheckReview,
        department: {
            departmentCode: dept?.code ?? p.department_code,
            name: dept?.name ?? p.department_name
        },
    };
};

// mapear datos a ProductLightResponse
export const mapProductRowToLightResponse = (p: any): ProductLightResponse => ({
    productCode: p.code,
    name: p.name
});

// mapear datos a CountResponse
export const mapProductCountToConditionCountResponse = (p: any): ConditionCountResponse => ({
    physicalCondition: p.physical_condition,
    count: p.count
})
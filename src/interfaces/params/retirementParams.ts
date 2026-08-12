import type { DateFilterOptions } from "../../types/dataFilterOptions.type";
import type { RetirementType } from "../../types/retirement.type";

export interface GetRetirementReportsParams {
    year?: number;
    dateMode?: DateFilterOptions;
    dateValue?: string;
    type?: RetirementType
    page?: number;
    limit?: number;
}

import { useState } from "react";
import { getLastRetirementReport, getRetirementReports, getTotalRetirements, getTotalRetirementsByYear } from "../../../services/retirementHistory/retirementHistory.service";
import type { RetirementHistoryResponse } from "../../../interfaces/responses/retirementHistoryResponse";
import type { GetRetirementReportsParams } from "../../../interfaces/params/retirementParams";
import { usePaginatedQuery } from "../../common/usePaginatedQuery";

interface RetirementReportStats {
    totalRetirements: number;
    currentYearRetirements: number;
    lastReport: RetirementHistoryResponse | null;
}

export const useRetirementReport = (params: GetRetirementReportsParams = {}) => {
    const [stats, setStats] = useState<RetirementReportStats | null>(null);

    async function action() {
        const currentYear = new Date().getFullYear();

        const [reportsData, totalCount, lastReport, yearCount] = await Promise.all([
            getRetirementReports(params),
            getTotalRetirements(),
            getLastRetirementReport(),
            getTotalRetirementsByYear(currentYear)
        ]);

        setStats({
            totalRetirements: totalCount,
            currentYearRetirements: yearCount,
            lastReport: lastReport
        });

        return reportsData;
    }

    const {
        data,
        total,
        totalPages,
        currentPage,
        loading,
        error,
        refetch
    } = usePaginatedQuery<RetirementHistoryResponse>(
        action,
        params,
        [params.type, params.dateMode, params.dateValue]
    );

    return {
        data,
        stats,
        total,
        totalPages,
        currentPage,
        loading,
        error,
        refetch
    };
};
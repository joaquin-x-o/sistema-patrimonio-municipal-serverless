import { useState } from "react";
import { getLossReports, getTotalLossReports, getLastLossReport } from "../../../services/lossHistory/lossHistory.service";
import type { LossHistoryResponse } from "../../../interfaces/responses/lossHistoryResponse";
import type { GetLossReportsParams } from "../../../interfaces/params/lossParams";
import { usePaginatedQuery } from "../../common/usePaginatedQuery";

interface LossReportStats {
    totalLossReports: number;
    lastLossReport: LossHistoryResponse | null;
}

export const useLossReport = (params: GetLossReportsParams = {}) => {
    const [stats, setStats] = useState<LossReportStats | null>(null);

    async function action() {
        const [reportsData, totalCount, lastReport] = await Promise.all([
            getLossReports(params),
            getTotalLossReports(),
            getLastLossReport()
        ]);

        setStats({
            totalLossReports: totalCount,
            lastLossReport: lastReport
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
    } = usePaginatedQuery<LossHistoryResponse>(
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
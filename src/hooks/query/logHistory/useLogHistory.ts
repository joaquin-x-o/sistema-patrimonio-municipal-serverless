// useLog.ts
import { useState } from "react";
import type { GetLogsParams } from "../../../interfaces/params/logParams";
import { usePaginatedQuery } from "../../common/usePaginatedQuery";
import type { LogResponse } from "../../../interfaces/responses/logHistoryResponse";
import { getLastLog, getLogs, getTotalLogs } from "../../../services/logHistory/logHistory.service";

interface LogStats {
    totalLogs: number;
    lastLog: LogResponse | null;
}

export const useLog = (params: GetLogsParams = {}) => {
    const [stats, setStats] = useState<LogStats | null>(null);

    async function action() {
        const [logsData, totalCount, lastLog] = await Promise.all([
            getLogs(params),
            getTotalLogs(),
            getLastLog()
        ]);

        setStats({
            totalLogs: totalCount,
            lastLog: lastLog
        });

        return logsData;
    }

    const {
        data,
        total,
        totalPages,
        currentPage,
        loading,
        error,
        refetch
    } = usePaginatedQuery<LogResponse>(
        action,
        params,
        [params.action, params.entityType, params.entityCode, params.dateMode, params.dateValue]
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




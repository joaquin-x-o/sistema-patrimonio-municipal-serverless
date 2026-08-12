import { useState } from "react";
import { getMaintenanceHistoryByCode, getLastMaintenance } from "../../../services/maintenanceHistory/maintenanceHistory.service";
import type { MaintenanceHistoryResponse } from "../../../interfaces/responses/maintenanceHistoryResponse";
import { usePaginatedQuery } from "../../common/usePaginatedQuery";

export const useMaintenanceReport = (productCode: string | undefined, page = 1, limit = 10) => {
    const [lastMaintenance, setLastMaintenance] = useState<MaintenanceHistoryResponse | null>(null);

    async function action() {
        if (!productCode) return { data: [], total: 0, totalPages: 1 };

        const [historyData, lastData] = await Promise.all([
            getMaintenanceHistoryByCode(productCode, page, limit),
            getLastMaintenance(productCode)
        ]);

        setLastMaintenance(lastData);
        return historyData;
    }

    const {
        data,
        total,
        totalPages,
        currentPage,
        loading,
        error,
        refetch
    } = usePaginatedQuery<MaintenanceHistoryResponse>(
        action,
        { page, limit },
        [productCode]
    );

    return {
        data,
        lastMaintenance,
        total,
        totalPages,
        currentPage,
        loading,
        error,
        refetch
    };
};
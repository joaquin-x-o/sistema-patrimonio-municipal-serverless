import { useState } from "react";
import { getLastMovement, getMovementHistoryByCode } from "../../../services/movementHistory/movementHistory.service";
import type { MovementHistoryResponse } from "../../../interfaces/responses/movementHistoryResponse";
import { usePaginatedQuery } from "../../common/usePaginatedQuery";

export const useMovementReport = (productCode: string | undefined, page = 1, limit = 10) => {
    const [lastMovement, setLastMovement] = useState<MovementHistoryResponse | null>(null);

    async function action() {
        if (!productCode) return { data: [], total: 0, totalPages: 1 };

        const [historyData, lastData] = await Promise.all([
            getMovementHistoryByCode(productCode, page, limit),
            getLastMovement(productCode)
        ]);

        setLastMovement(lastData);
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
    } = usePaginatedQuery<MovementHistoryResponse>(
        action,
        { page, limit },
        [productCode]
    );

    return {
        data,
        lastMovement,
        total,
        totalPages,
        currentPage,
        loading,
        error,
        refetch
    };
};
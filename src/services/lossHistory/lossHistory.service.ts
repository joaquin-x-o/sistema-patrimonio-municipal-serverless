// lossHistory.service.ts
import type { LossHistoryResponse } from "../../interfaces/responses/lossHistoryResponse";
import type { GetLossReportsParams } from "../../interfaces/params/lossParams";
import { getLossReportsDb, getTotalLossReportsDb, getLastLossReportDb, getLastProductLossReportDateDb, getLossReportsForExportDb } from "../../repositories/lossHistory/lossHistory.repository";
import { mapLossRowReportToResponse } from "../../lib/maps/responses/reportResponseMapper";
import { mapLossesForExport } from "../../lib/maps/excel/mapLossReportForExcel";


// obtener los registros de perdidas de productos con paginacion
export const getLossReports = async (params: GetLossReportsParams = {}) => {
    const { page = 1, limit = 5 } = params;
    const { data, count } = await getLossReportsDb(params);

    const reports = (data ?? []).map(mapLossRowReportToResponse)

    return {
        data: reports,
        total: count ?? 0,
        currentPage: page,
        totalPages: Math.ceil((count ?? 0) / limit)
    };
};

// obtener total de reportes de perdida
export const getTotalLossReports = async () => getTotalLossReportsDb();

// obtener ultimo reporte de perdida
export const getLastLossReport = async (): Promise<LossHistoryResponse | null> => {
    try {
        const data = await getLastLossReportDb();
        return mapLossRowReportToResponse(data);
    } catch {
        return null;
    }
};

// obtener ultimo reporte de perdida
export const getLastProductLossReportDate = async (productId: number): Promise<String | null> => {
    try {
        const date = await getLastProductLossReportDateDb(productId);
        return date;
    } catch {
        return null;
    }
};

export const getLossesForExport= async () => {
  const losses = await getLossReportsForExportDb();
  return mapLossesForExport(losses);
};
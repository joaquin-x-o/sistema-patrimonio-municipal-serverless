// retirementHistory.service.ts
import type { GetRetirementReportsParams } from "../../interfaces/params/retirementParams";
import { getLastRetirementReportDb, getRetirementReportsDb, getRetirementReportsForExportDb, getTotalRetirementsByYearDb, getTotalRetirementsDb } from "../../repositories/retirementHistory/retirementHistory.repository";
import { mapRetirementRowReportToResponse } from "../../lib/maps/responses/reportResponseMapper";
import type { RetirementHistoryResponse } from "../../interfaces/responses/retirementHistoryResponse";
import { mapRetirementsForExport } from "../../lib/maps/excel/mapRetirementReportForExport";

// obtener los registros de bajas de productos con paginacion 
export const getRetirementReports = async (params: GetRetirementReportsParams = {}) => {
    const { page = 1, limit = 5 } = params;
    const { data, count } = await getRetirementReportsDb(params);

    const reports = (data ?? []).map(mapRetirementRowReportToResponse)

    return {
        data: reports,
        total: count ?? 0,
        currentPage: page,
        totalPages: Math.ceil((count ?? 0) / limit)
    };
};

// obtener el total de bajas de productos por año
export const getTotalRetirementsByYear = async (year: number) => getTotalRetirementsByYearDb(year);

// obtener el total de bajas de productos
export const getTotalRetirements = async () => getTotalRetirementsDb();

// obtener ultimo reporte de baja
export const getLastRetirementReport = async (): Promise<RetirementHistoryResponse | null> => {
    try {
        const data = await getLastRetirementReportDb();
        return mapRetirementRowReportToResponse(data);
    } catch {
        return null;
    }
};

export const getRetirementsForExport = async () => {
  const retirements = await getRetirementReportsForExportDb();
  return mapRetirementsForExport(retirements);
};
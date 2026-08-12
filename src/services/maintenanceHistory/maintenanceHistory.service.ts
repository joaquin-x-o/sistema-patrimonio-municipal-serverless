import type { MaintenanceHistoryResponse } from "../../interfaces/responses/maintenanceHistoryResponse";
import { mapProductRowToLightResponse } from "../../lib/maps/responses/productResponseMapper";
import { mapMaintenanceRowReportToResponse } from "../../lib/maps/responses/reportResponseMapper";
import { getMaintenanceHistoryByCodeDb, getLastMaintenanceByCodeDb, getMaintenanceProductListDb } from "../../repositories/maintenanceHistory/maintenanceHistory.repository";
import type { ProductLightResponse } from "../../schemas/product.schemas";

// obtener mantenimiento de un producto
export const getMaintenanceHistoryByCode = async (productCode: string | number, page = 1, limit = 10) => {
    const code = typeof productCode === 'string' ? parseInt(productCode, 10) : productCode;

    const { data, count } = await getMaintenanceHistoryByCodeDb(code, page, limit);

    const maintenanceReport = (data ?? []).map(mapMaintenanceRowReportToResponse)

    return {
        data: maintenanceReport,
        total: count ?? 0,
        currentPage: page,
        totalPages: Math.ceil((count ?? 0) / limit)
    };
};

// obtener ultimo mantenimiento realizado
export const getLastMaintenance = async (productCode: string | number): Promise<MaintenanceHistoryResponse | null> => {
    const code = typeof productCode === 'string' ? parseInt(productCode, 10) : productCode;

    const data = await getLastMaintenanceByCodeDb(code);

    if (!data) return null;

    const lastMaintenance = mapMaintenanceRowReportToResponse(data)

    return lastMaintenance;
};

// obtener lista de productos que poseen al menos un registro de mantenimiento
export const getMaintenanceProductList = async (): Promise<ProductLightResponse[]> => {
    const data = await getMaintenanceProductListDb();

    const productList = (data ?? []).map(mapProductRowToLightResponse)

    return productList;
};
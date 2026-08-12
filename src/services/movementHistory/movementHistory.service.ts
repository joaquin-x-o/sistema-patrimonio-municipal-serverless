import type { MovementHistoryResponse } from "../../interfaces/responses/movementHistoryResponse";
import { mapProductRowToLightResponse } from "../../lib/maps/responses/productResponseMapper";
import { mapMovementRowReportToResponse } from "../../lib/maps/responses/reportResponseMapper";
import { getMovementHistoryByCodeDb, getLastMovementByCodeDb, getMovementProductListDb } from "../../repositories/movementHistory/movementHistory.repository";
import type { ProductLightResponse } from "../../schemas/product.schemas";


// obtener historial de movimientos de un producto
export const getMovementHistoryByCode = async (productCode: string | number, page = 1, limit = 10) => {
    const code = typeof productCode === 'string' ? parseInt(productCode, 10) : productCode;
    const { data, count } = await getMovementHistoryByCodeDb(code, page, limit);

    const movementReport = (data ?? []).map(mapMovementRowReportToResponse)


    return {
        data: movementReport,
        total: count ?? 0,
        currentPage: page,
        totalPages: Math.ceil((count ?? 0) / limit)
    };
};

// obtener ultimo registro de movimietnto realizado
export const getLastMovement = async (productCode: string | number): Promise<MovementHistoryResponse | null> => {
    const code = typeof productCode === 'string' ? parseInt(productCode, 10) : productCode;

    const data = await getLastMovementByCodeDb(code);
    if (!data) return null;

    const lastMovement = mapMovementRowReportToResponse(data)

    return lastMovement;
};

// obtener productos que poseen un registro de movimiento
export const getMovementProductList = async (): Promise<ProductLightResponse[]> => {
    const data = await getMovementProductListDb();

    const productList = (data ?? []).map(mapProductRowToLightResponse)

    return productList;
};
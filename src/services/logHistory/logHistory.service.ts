import type { CreateLogParams, GetLogsParams } from "../../interfaces/params/logParams";
import type { LogResponse } from "../../interfaces/responses/logHistoryResponse";
import { mapLogRowToResponse } from "../../lib/maps/responses/reportResponseMapper";
import { createLogDb, getLastLogDb, getLogsDb, getTotalLogsDb } from "../../repositories/logHistory/logHistory.repository";


// registrar un nuevo log de auditoria
export const createLog = async (params: CreateLogParams) => {
    try {
        await createLogDb(params);
    } catch (err) {
        console.error('Error al crear el log:', err);
    }
};

// obtener los logs con paginacion
export const getLogs = async (params: GetLogsParams = {}) => {
    const { page = 1, limit = 5 } = params;
    const { data, count } = await getLogsDb(params);

    const logs = (data ?? []).map(mapLogRowToResponse);

    return {
        data: logs,
        total: count ?? 0,
        currentPage: page,
        totalPages: Math.ceil((count ?? 0) / limit)
    };
};

// obtener total de logs
export const getTotalLogs = async () => getTotalLogsDb();

// obtener el ultimo log
export const getLastLog = async (): Promise<LogResponse | null> => {
    try {
        const data = await getLastLogDb();
        return mapLogRowToResponse(data);
    } catch {
        return null;
    }
};
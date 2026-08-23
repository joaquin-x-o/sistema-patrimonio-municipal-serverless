import type { GetLogsParams } from "../../interfaces/params/logParams";
import type { CreateLogDto } from "../../interfaces/requests/logRequest";
import { supabase } from "../../lib/supabase";

export const createLogDb = async (dto: CreateLogDto) => {
    const { error } = await supabase
        .from('log_system')
        .insert({
            action: dto.action,
            entity_type: dto.entityType,
            entity_code: dto.entityCode,
            description: dto.description,
            old_data: dto.oldData ?? null,
            new_data: dto.newData ?? null,
            timestamp: new Date().toISOString(),
        });

    if (error) throw new Error(error.message);
};

// obtener los registros de logs
export const getLogsDb = async ({ action, entityType, entityCode, dateMode, dateValue, page = 1, limit = 5 }: GetLogsParams) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('log_system')
        .select(`
            id,
            action,
            entity_type,
            entity_code,
            description,
            old_data,
            new_data,
            timestamp,
            created_at,
            user ( name, surname )
        `, { count: 'exact' })
        .range(from, to)
        .order('timestamp', { ascending: false });

    if (action) query = query.eq('action', action);
    if (entityType) query = query.eq('entity_type', entityType);
    if (entityCode) query = query.eq('entity_code', entityCode);

    if (dateValue && dateMode) {
        if (dateMode === "EXACT") {
            query = query.gte('timestamp', `${dateValue}T00:00:00.000Z`).lte('timestamp', `${dateValue}T23:59:59.999Z`);
        }
        if (dateMode === "BEFORE") {
            query = query.lt('timestamp', `${dateValue}T00:00:00.000Z`);
        }
        if (dateMode === "AFTER") {
            query = query.gt('timestamp', `${dateValue}T23:59:59.999Z`);
        }
    }

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data, count };
};

// obtener el total de logs
export const getTotalLogsDb = async () => {
    const { count, error } = await supabase
        .from('log_system')
        .select('id', { count: 'exact', head: true });

    if (error) throw new Error(error.message);
    return count ?? 0;
};

// obtener el último log registrado
export const getLastLogDb = async () => {
    const { data, error } = await supabase
        .from('log_system')
        .select(`
            id,
            action,
            entity_type,
            entity_code,
            description,
            old_data,
            new_data,
            timestamp,
            created_at,
            user ( name, surname )
        `)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

    if (error) throw new Error(error.message);
    return data;
};
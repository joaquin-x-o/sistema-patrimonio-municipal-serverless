// retirementHistory.repository.ts
import type { GetRetirementReportsParams } from "../../interfaces/params/retirementParams";
import { supabase } from "../../lib/supabase";

// obtener los registros de bajas de productos con paginacion y filtrado
export const getRetirementReportsDb = async ({ year, dateMode, dateValue, type, page = 1, limit = 10 }: GetRetirementReportsParams) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('retirement_history')
        .select(`
            doc_reference,
            reason,
            type,
            date,
            product ( code, name, department ( code, name, responsible_name ) ),
            user ( name, surname )
        `, { count: 'exact' })
        .range(from, to)
        .order('date', { ascending: false });

    // filtros
    if (year) {
        query = query
            .gte('date', `${year}-01-01T00:00:00.000Z`)
            .lte('date', `${year}-12-31T23:59:59.999Z`);
    }

    if (dateValue && dateMode) {
        if (dateMode === "EXACT") {
            query = query.gte('date', `${dateValue}T00:00:00.000Z`).lte('date', `${dateValue}T23:59:59.999Z`);
        }
        if (dateMode === "BEFORE") {
            query = query.lt('date', `${dateValue}T00:00:00.000Z`);
        }
        if (dateMode === "AFTER") {
            query = query.gt('date', `${dateValue}T23:59:59.999Z`);
        }
    }

    if (type) query = query.eq('type', type);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return { data, count };
};

// obtener el total de bajas de productos sin paginacion ni filtrado
export const getTotalRetirementsDb = async () => {
    const { count, error } = await supabase
        .from('retirement_history')
        .select('id', { count: 'exact', head: true });

    if (error) throw new Error(error.message);
    return count ?? 0;
};

// obtener el total de bajas de productos por año
export const getTotalRetirementsByYearDb = async (year: number) => {
    const { count, error } = await supabase
        .from('retirement_history')
        .select('id', { count: 'exact', head: true })
        .gte('date', `${year}-01-01T00:00:00.000Z`)
        .lte('date', `${year}-12-31T23:59:59.999Z`);

    if (error) throw new Error(error.message);
    return count ?? 0;
};

// obtener el último reporte de baja/retiro registrado
export const getLastRetirementReportDb = async () => {
    const { data, error } = await supabase
        .from('retirement_history')
        .select(`
            doc_reference,
            reason,
            date,
            type,
            product ( code, name ),
            user ( name, surname )
        `)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) throw new Error(error.message);
    return data;
};
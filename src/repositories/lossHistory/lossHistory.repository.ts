// lossHistory.repository.ts
import type { GetLossReportsParams } from "../../interfaces/params/lossParams";
import type { LossExportRow } from "../../interfaces/responses/lossHistoryResponse";
import { fetchAllPaginated } from "../../lib/excel/fetchAllPaginated";
import { supabase } from "../../lib/supabase";

// obtener los registros de pérdidas de productos 
export const getLossReportsDb = async ({ type, dateMode, dateValue, page = 1, limit = 5 }: GetLossReportsParams) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('loss_history')
        .select(`
            complaint_reference,
            date,
            type,
            details,
            product ( code, name, status),
            user ( name, surname ),
            department:last_department_id ( code, name, responsible_name )
        `, { count: 'exact' })
        .range(from, to)
        .order('date', { ascending: false });

    if (type) query = query.eq('type', type);

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

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data, count };
};

// obtener el total de pérdidas de productos
export const getTotalLossReportsDb = async () => {
    const { count, error } = await supabase
        .from('loss_history')
        .select('id', { count: 'exact', head: true });

    if (error) throw new Error(error.message);
    return count ?? 0;
};

// obtener el último reporte de pérdida registrado
export const getLastLossReportDb = async () => {
    const { data, error } = await supabase
        .from('loss_history')
        .select(`
            complaint_reference,
            date,
            type,
            details,
            product ( code, name ),
            user ( name, surname ),
            department:last_department_id ( code, name, responsible_name )
        `)
        .order('date', { ascending: false })
        .limit(1)
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// obtener el ultimo reporte de perdida de un producto especifico
export const getLastProductLossReportDb = async () => {
    const { data, error } = await supabase
        .from('loss_history')
        .select(`

            date,
            type,
            details,
            product ( code, name ),
            user ( name, surname ),
            department:last_department_id ( code, name, responsible_name )
        `)
        .order('date', { ascending: false })
        .limit(1)
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// obtener fecha del ultimo reporte de perdida de un producto
export const getLastProductLossReportDateDb = async (productId: number) => {
    const { data, error } = await supabase
        .from("loss_history")
        .select("date")
        .eq("product_id", productId)
        .order("date", { ascending: false })
        .limit(1)
        .single();

    if (error) throw new Error(error.message);

    return data?.date ?? null;
};

export const getLossReportsForExportDb = async () => {
  return fetchAllPaginated<LossExportRow>(async (from, to) => {
    const { data, error } = await supabase
      .from('loss_history')
      .select(`
        complaint_reference,
        date,
        type,
        details,
        product ( code, name, status ),
        user ( name, surname ),
        department:last_department_id ( code, name, responsible_name )
      `)
      .order('date', { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as LossExportRow[];
  });
};
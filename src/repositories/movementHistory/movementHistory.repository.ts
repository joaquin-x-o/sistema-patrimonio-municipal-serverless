import type { MovementExportRow } from "../../interfaces/responses/movementHistoryResponse";
import { fetchAllPaginated } from "../../lib/excel/fetchAllPaginated";
import { supabase } from "../../lib/supabase";
import { getProductId } from "../products/products.repository";

// obtener historial de movimientos de un producto
export const getMovementHistoryByCodeDb = async (productCode: number, page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const productId = await getProductId(productCode);

    const { data, error, count } = await supabase
        .from('movement_history')
        .select(`
            date,
            reason,
            user ( name, surname ),
            origin:origin_department_id ( code, name ),
            destination:destination_department_id ( code, name )
        `, { count: 'exact' })
        .eq('product_id', productId)
        .range(from, to)
        .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, count };
};

// obtener ultimo registro de movimietnto realizado
export const getLastMovementByCodeDb = async (productCode: number) => {
    const productId = await getProductId(productCode);

    const { data, error } = await supabase
        .from('movement_history')
        .select(`
            date,
            reason,
            user ( name, surname ),
            origin:origin_department_id ( code, name ),
            destination:destination_department_id ( code, name )
        `)
        .eq('product_id', productId)
        .order('date', { ascending: false })
        .limit(1)
        .single();

    if (error) return null;
    return data;
};

// obtener productos que poseen un registro de movimiento
export const getMovementProductListDb = async () => {
    const { data, error } = await supabase
        .rpc('get_movement_product_list');

    if (error) throw new Error(error.message);
    return data as { code: number; name: string }[];
};

// determinar si un producto tiene al menos un registro de traslado
export const hasMovementHistoryDb = async (productId: number): Promise<boolean> => {
    const { data, error } = await supabase
        .from('movement_history')
        .select('id')
        .eq('product_id', productId)
        .limit(1);

    if (error) throw error;
    return data.length > 0;
};

// obtener todo el historial de movimientos de un producto para exportar a excel
export const getMovementHistoryForExportDb = async (productCode: number) => {
  const productId = await getProductId(productCode);

  return fetchAllPaginated<MovementExportRow>(async (from, to) => {
    const { data, error } = await supabase
      .from('movement_history')
      .select(`
        date,
        reason,
        user ( name, surname ),
        origin:origin_department_id ( code, name ),
        destination:destination_department_id ( code, name )
      `)
      .eq('product_id', productId)
      .order('date', { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as MovementExportRow[];
  });
};
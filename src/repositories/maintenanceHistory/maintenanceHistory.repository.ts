import type { MaintenanceExportRow } from "../../interfaces/responses/maintenanceHistoryResponse";
import { fetchAllPaginated } from "../../lib/excel/fetchAllPaginated";
import { supabase } from "../../lib/supabase";
import { getProductId } from "../products/products.repository";

// obtener historial de mantenimiento de un producto
export const getMaintenanceHistoryByCodeDb = async (productCode: number, page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const productId = await getProductId(productCode)

    const { data, error, count } = await supabase
        .from('maintenance_history')
        .select(`
            repair_date,
            repair_description,
            unusable_date,
            breakdown_reason,
            cost,
            user ( name, surname )
        `, { count: 'exact' })
        .eq('product_id', productId)
        .range(from, to)
        .order('repair_date', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, count };
};

// obtener ultimo mantenimiento
export const getLastMaintenanceByCodeDb = async (productCode: number) => {

    const productId = await getProductId(productCode)

    const { data, error } = await supabase
        .from('maintenance_history')
        .select(`
            repair_date,
            repair_description,
            unusable_date,
            breakdown_reason,
            cost,
            user ( name, surname )
        `)
        .eq('product_id', productId)
        .order('repair_date', { ascending: false })
        .limit(1)
        .single();

    if (error) return null;
    return data;
};


// obtener lista de productos que tienen un registro mantenimiento 
export const getMaintenanceProductListDb = async () => {
    // funcion rpc para solo traer un registro unico por producto y no traer todos
    const { data, error } = await supabase.rpc('get_maintenance_product_list');

    if (error) throw new Error(error.message);
    return data as { code: number; name: string }[];
};

// determinar si un producto tiene al menos un registro de mantenimiento
export const hasMaintenanceHistoryDb = async (productId: number): Promise<boolean> => {
    const { data, error } = await supabase
        .from('maintenance_history')
        .select('id')
        .eq('product_id', productId)
        .limit(1);

    if (error) throw error;
    return data.length > 0;
};

export const getMaintenanceHistoryForExportDb = async (productCode: number) => {
  const productId = await getProductId(productCode);

  return fetchAllPaginated<MaintenanceExportRow>(async (from, to) => {
    const { data, error } = await supabase
      .from('maintenance_history')
      .select(`
        repair_date,
        repair_description,
        unusable_date,
        breakdown_reason,
        cost,
        user ( name, surname )
      `)
      .eq('product_id', productId)
      .order('repair_date', { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as MaintenanceExportRow[];
  });
};
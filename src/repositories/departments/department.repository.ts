import type { CreateDepartmentDto, UpdateDepartmentDto } from "../../interfaces/requests/departmentRequests";
import type { DepartmentWithCountRow } from "../../interfaces/responses/departmentResponse";
import { supabase } from "../../lib/supabase";
import { getTodayDateISO } from "../../utils/date/getTodayDate";
import { handleSingleError } from "../../utils/supabase/handleError";


// obtener departamentos completos con paginación
export const getDepartmentsDb = async (): Promise<DepartmentWithCountRow[]> => {
    // se usa un rpc function al ser un get determinado por el orden de productos que contiene cada area. No es un getAll tradicional
    const { data, error } = await supabase.rpc('get_all_departments_with_counts');

    if (error) throw new Error(error.message);

    return data;
};

export const getDepartmentListDb = async () => {
    const { data, error } = await supabase
        .from('department')
        .select('code, name')
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
};


// obtener area por codigo
export const getDepartmentByCodeDb = async (code: string) => {
    const { data, error } = await supabase
        .from('department')
        .select('code, name, responsible_name, is_active, created_at, updated_at')
        .eq('code', code)
        .single();

    if (error) handleSingleError(error, "área");
    return data;
};

export const getDepartmentProductCountStatsDb = async (limit: number) => {

    // dada la complejidad de la consulta, se opta por usar una funcion rpc creada en supabase 
    const { data, error } = await supabase.rpc('get_department_product_counts', { limit_count: limit });

    if (error) throw new Error(error.message);

    return data;
};

// obtener id de un departamento
export const getDepartmentId = async (departmentCode: string): Promise<number> => {
    const { data, error } = await supabase
        .from("department")
        .select("department_id")
        .eq("code", departmentCode)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("No se encontró el departamento.");
    }

    return data.department_id;
};

// ACCIONES ---------------------

// crear area
export const createDepartmentDb = async (dto: CreateDepartmentDto) => {

    const today = getTodayDateISO()

    const { data, error } = await supabase
        .from("department")
        .insert({
            code: dto.departmentCode,
            name: dto.name,
            responsible_name: dto.responsibleName,
            is_active: true,
            updated_at: today
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// editar datos de area
export const updateDepartmentDb = async (departmentId: number, dto: UpdateDepartmentDto) => {
    const { data, error } = await supabase
        .from("department")
        .update({
            code: dto.departmentCode,
            name: dto.name,
            responsible_name: dto.responsibleName,
            updated_at: dto.updatedAt,
        })
        .eq("department_id", departmentId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// habilitar area
export const enableDepartmentDB = async (departmentId: number) => {
    const today = getTodayDateISO();

    const { data, error } = await supabase
        .from('department')
        .update({
            is_active: true,
            updated_at: today
        })
        .eq('department_id', departmentId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// deshabilitar area
export const disableDepartmentDB = async (departmentId: number) => {
    const today = getTodayDateISO();

    const { data, error } = await supabase
        .from('department')
        .update({
            is_active: false,
            updated_at: today
        })
        .eq('department_id', departmentId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// borrar area
export const deleteDepartmentDb = async (departmentId: number) => {

    const { error } = await supabase
        .from("department")
        .delete()
        .eq("department_id", departmentId);

    if (error) {
        throw new Error(error.message);
    }

    return true;
};

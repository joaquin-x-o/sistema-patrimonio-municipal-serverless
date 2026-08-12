import { supabase } from "../../lib/supabase";
import type { ProductsParams } from "../../interfaces/params/productParams";
import { handleSingleError } from "../../utils/supabase/handleError";
import type { CreateProductDto, LostProductDto, RepairProductDto, RetireProductDto, TransferProductDto, UnusableProductDto, UpdateProductDto } from "../../interfaces/requests/productRequests";
import type { ReviewProductRequest } from "../../schemas/product.schemas";
import { ProductStatus } from "../../types/product.type";
import { getTodayDateISO } from "../../utils/date/getTodayDate";


// CONSULTAS ----------------------------------

// obtener productos con filtros y paginación
export const getProductsDb = async ({ category, condition, status, dateMode, dateValue, departmentCode, page = 1, limit = 10 }: ProductsParams) => {

    // paginacion
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('product')
        .select(`
            code,
            name,
            category,
            physical_condition,
            registration_date,
            is_legacy,
            status,
            status_updated_at,
            date_unusable,
            unusable_reason,
            last_check_date,
            pending_review_reason,
            department (code, name )
        `, { count: 'exact' })
        .neq('status', 'RETIRED')
        .range(from, to)
        .order('created_at', { ascending: false });

    // filtros
    if (category) query = query.eq('category', category);
    if (condition) query = query.eq('physical_condition', condition);
    if (status) query = query.eq('status', status);

    if (dateValue && dateMode) {
        if (dateMode === "EXACT") {
            const start = `${dateValue}T00:00:00.000Z`;
            const end = `${dateValue}T23:59:59.999Z`;
            query = query.gte('registration_date', start).lte('registration_date', end);
        }
        if (dateMode === "BEFORE") {
            query = query.lt('registration_date', `${dateValue}T00:00:00.000Z`);
        }
        if (dateMode === "AFTER") {
            query = query.gt('registration_date', `${dateValue}T23:59:59.999Z`);
        }
    }

    if (departmentCode) {
        const { data: dept } = await supabase
            .from('department')
            .select('department_id')
            .eq('code', departmentCode)
            .single();

        if (dept) query = query.eq('department_id', dept.department_id);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return { data, count };
};

// obtener lista de productosm solo nombre y codigo
export const getProductListDb = async () => {
    const { data, error } = await supabase
        .from('product')
        .select('code, name')
        .neq('status', 'RETIRED')
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
};

// obtener producto por código
export const getProductByCodeDb = async (code: number) => {
    const { data, error } = await supabase
        .from('product')
        .select(`
            code,
            name,
            description,
            observation,
            category,
            physical_condition,
            is_legacy,
            status,
            status_updated_at,
            registration_date,
            date_unusable,
            unusable_reason,
            retirement_date,
            last_check_date,
            pending_review_reason,
            created_at,
            updated_at,
            department ( code, name ),
            user ( name, surname )
        `)
        .eq('code', code)
        .single();

    if (error) handleSingleError(error, "producto");

    return data;
};


// obtener conteo de productos por estado de revisión
export const getReviewCountsDb = async () => {
    const { data, error } = await supabase
        .from('product')
        .select('status')
        .in('status', ['IN_REVIEW', 'LOST', 'UNUSABLE']);

    if (error) throw new Error(error.message);
    return data;
};

// obtener los codigos de area de los productos activos (para realizar el conteo de estadísticas por departamento en el service)
export const getProductDepartmentCodesDb = async () => {
    const { data, error } = await supabase
        .from('product')
        .select('department ( code )')
        .neq('status', 'RETIRED');

    if (error) throw new Error(error.message);
    return data;
};

// obtener fechas de último chequeo de productos (para CONTEO de productos que necesitan constatacion)
export const getProductsLastCheckDateDb = async () => {
    const { data, error } = await supabase
        .from('product')
        .select('last_check_date')
        .neq('status', 'RETIRED');

    if (error) throw new Error(error.message);
    return data;
};

// obtener id de un producto
export const getProductId = async (productCode: number) => {
    const { data, error } = await supabase
        .from('product')
        .select('product_id')
        .eq('code', productCode)
        .single();

    if (error) throw new Error(error.message);
    return data.product_id;
};

// obtener productos que necesitan constatacion
export const getProductsNeedingCheckDb = async () => {

    // se utiliza una funcion rpc debido a su complejidad
    // NOTA: el proceso principal de la funcion es calcular si last_check_date es mayor a 180 dias o bien si es null.
    // En caso de que cumpla con uno de esos criterios, solo se traen esos productos

    const { data, error } = await supabase.rpc('get_products_needing_check');

    if (error) throw new Error(error.message);
    return data;
};

// obtener productos segun estado
export const getProductsByStatusDb = async (status: string) => {
    const { data, error } = await supabase
        .from('product')
        .select(`
            code,
            name,
            category,
            physical_condition,
            registration_date,
            is_legacy,
            status,
            status_updated_at,
            date_unusable,
            unusable_reason,
            last_check_date,
            pending_review_reason,
            department ( code, name )
        `)
        .eq('status', status);

    if (error) throw new Error(error.message);
    return data;
};

// buscar producto
export const searchProductsLightDb = async (query: string) => {
    // se utiliza un rpc function para ignorar acentos durante la busqueda y su respectiva limitacion de busquedas
    const { data, error } = await supabase
        .rpc('search_products_light', { search_query: query });

    if (error) throw new Error(error.message);
    return data as { code: number; name: string }[];
};

// obtener ultimo codigo 
export const getLastProductCodeDb = async (): Promise<number | null> => {
    const { data, error } = await supabase
        .from("product")
        .select("code")
        .order("code", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data?.code ?? null;
};

// obtener conteo de productos segun condicion fisica
export const getProductCountByConditionDb = async () => {
    // para un manejo eficiente, se utiliza una rpc function desde
    const { data, error } = await supabase.rpc("get_product_count_by_condition");

    if (error) {
        throw error;
    }

    return data;
};

// traer ultimo
export const getProductLastCheckDateDb = async (productId: number) => {
    const { data, error } = await supabase
        .from('product')
        .select('last_check_date')
        .eq('product_id', productId)
        .single();

    if (error) throw error;
    return data;
};

// ACCIONES ----------------------------------------

// crear producto
export const createProductDb = async (product: CreateProductDto) => {
    const { data, error } = await supabase
        .from("product")
        .insert(product)
        .select()
        .single();

    if (error) throw error;

    return data;
};

// actualizar datos de producto
export const updateProductDb = async (productId: number, dto: UpdateProductDto) => {

    const { data, error } = await supabase
        .from("product")
        .update(dto)
        .eq("product_id", productId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

// mandar producto a revision
export const sendProductToReviewDb = async (productId: number, dto: ReviewProductRequest) => {
    const today = getTodayDateISO();

    const { data, error } = await supabase
        .from('product')
        .update({
            status: ProductStatus.IN_REVIEW,
            pending_review_reason: dto.pendingReviewReason,
            status_updated_at: today,
            updated_at: today
        })
        .eq('product_id', productId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// aprobar revision
export const approveReviewDb = async (productId: number) => {
    const today = getTodayDateISO();

    const { data, error } = await supabase
        .from('product')
        .update({
            status: ProductStatus.ACTIVE,
            pending_review_reason: null,
            last_check_date: today,
            status_updated_at: today,
            updated_at: today
        })
        .eq('product_id', productId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// marcar producto como encontrado
export const markProductAsFoundDb = async (productId: number) => {
    const today = getTodayDateISO();

    const { data, error } = await supabase
        .from('product')
        .update({
            status: 'ACTIVE',
            last_check_date: today,
            status_updated_at: today,
            updated_at: today
        })
        .eq('product_id', productId)
        .select()
        .single();

    if (error) throw error;
    return data;
};


// transferir producto a otra area
export const transferProductDb = async (dto: TransferProductDto) => {
    const { data, error } = await supabase.rpc("transfer_product", dto);

    if (error) throw error;
    return data?.[0];
};

// marcar producto como averiado
export const markProductUnusableDb = async (productId: number, dto: UnusableProductDto) => {
    const today = getTodayDateISO();

    const updatePayload: any = {
        status: 'UNUSABLE',
        unusable_reason: dto.unusableReason,
        date_unusable: today,
        status_updated_at: today,
        updated_at: today
    };

    if (dto.physicalCondition) {
        updatePayload.physical_condition = dto.physicalCondition;
    }

    const { data, error } = await supabase
        .from('product')
        .update(updatePayload)
        .eq('product_id', productId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// reparar producto
export const repairProductDb = async (dto: RepairProductDto) => {
    const { data, error } = await supabase.rpc("repair_product", dto);

    if (error) throw error;
    return data?.[0];
};


// marcar producto como perdido
export const markProductAsLostDb = async (dto: LostProductDto) => {
    const { data, error } = await supabase.rpc("mark_product_as_lost", dto);

    if (error) throw error;
    return data?.[0];
};

// dar de baja
export const retireProductDb = async (dto: RetireProductDto): Promise<boolean> => {
    // se utiliza una funcion rpc para manejar las transacciones entre actualizar el estado del producto y registrar el cambio en el historial
    const { error } = await supabase.rpc("retire_product", dto);

    if (error) throw error;
    return true;
};

// habilitar producto dado de baja
export const enableProductDb = async (productId: number) => {
    const today = getTodayDateISO();

    const { data, error } = await supabase
        .from('product')
        .update({
            status: 'ACTIVE',
            unusable_reason: null,
            date_unusable: null,
            pending_review_reason: null,
            retirement_date: null,
            last_check_date: today,
            status_updated_at: today,
            updated_at: today
        })
        .eq('product_id', productId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// constatar producto
export const checkProductExistenceDb = async (productId: number) => {
    const today = getTodayDateISO();

    const { data, error } = await supabase
        .from('product')
        .update({
            last_check_date: today,
            updated_at: today
        })
        .eq('product_id', productId)
        .select('last_check_date')
        .single();

    if (error) throw error;
    return data;
};

// borrar producto
export const deleteProductDb = async (productId: number) => {

    const { error } = await supabase
        .from("product")
        .delete()
        .eq("product_id", productId);

    if (error) {
        throw new Error(error.message);
    }

    return true;
};
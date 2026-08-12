import { supabase, supabaseAuthAdmin } from "../../lib/supabase";
import type { PaginationParams } from "../../interfaces/params/paginationParams";
import { handleSingleError } from "../../utils/supabase/handleError";
import type { CreateUserDto, UpdateUserDto } from "../../interfaces/requests/userRequests";
import { getTodayDateISO } from "../../utils/date/getTodayDate";

export const getUsersDb = async ({ page = 1, limit = 10 }: PaginationParams) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error, count } = await supabase
        .from('user')
        .select('id, name, surname, username, is_active, role', { count: 'exact' })
        .range(from, to)
        .neq('id', user!.id)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, count };
};

export const getUserByUsernameDb = async (username: string) => {
    const { data, error } = await supabase
        .from('user')
        .select('id, name, surname, username, is_active, role, updated_at')
        .eq('username', username)
        .single();

    if (error) return handleSingleError(error, "usuario")
    return data;
};

export const getUserListDb = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('user')
        .select('name, surname, username')
        .neq('id', user!.id)
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
};

// verificar username duplicado
export const checkUsernameExistsDb = async (username: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('user')
        .select('username')
        .eq('username', username.trim().toLowerCase())
        .maybeSingle();

    if (error) throw error;
    return !!data;
};

// obtener id de un producto
export const getUserId = async (username: string) => {
    const { data, error } = await supabase
        .from('user')
        .select('id')
        .eq('username', username)
        .single();

    if (error) throw new Error(error.message);
    return data.id;
};

// ACCIONES --------------------------

// crear usuario
export const createUserDb = async (dto: CreateUserDto) => {
    const genericEmail = `${dto.username.trim()}@interno.local`;

    // creacion de usuario en Auth de Supabase mediante el cliente auxiliar
    const { data: authData, error: authError } = await supabaseAuthAdmin.auth.signUp({
        email: genericEmail,
        password: dto.password,
        options: {
            data: { username: dto.username.trim() }
        }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("No se pudo generar la credencial de autenticación.");

    const today = getTodayDateISO();

    // asignacion y retorno de datos a la tabla pública de usuarios
    const { data, error: publicError } = await supabase
        .from('user')
        .insert({
            id: authData.user.id,
            name: dto.name.trim(),
            surname: dto.surname.trim(),
            username: dto.username.trim().toLowerCase(),
            role: dto.role,
            is_active: true,
            created_at: today,
            updated_at: today
        })
        .select()
        .single();

    if (publicError) {
        throw publicError;
    }

    return data;
};

// editar datos de usuario
export const updateUserDb = async (userId: string, dto: UpdateUserDto) => {

    const { data, error } = await supabase
        .from("user")
        .update(dto)
        .eq("id", userId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

// habilitar usuario
export const enableUserDB = async (userId: string) => {
    const today = getTodayDateISO();

    const { data, error } = await supabase
        .from('user')
        .update({
            is_active: true,
            updated_at: today
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// deshabilitar usuario
export const disableUserDB = async (userId: string) => {
    const today = getTodayDateISO();

    const { data, error } = await supabase
        .from('user')
        .update({
            is_active: false,
            updated_at: today
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// eliminar usuario
export const deleteUserDb = async (userId: string) => {
    const { error } = await supabase
        .from("user")
        .delete()
        .eq("id", userId);

    if (error) {
        throw new Error(error.message);
    }

    return true;
};


import { supabase } from "../../lib/supabase";

// ingresar sesion
export const signInDb = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error
    return data;
};

// cerrar sesion
export const signOutDb = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
};

// obtener sesion
export const getSessionDb = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};


// cambiar contraseña (propia)
export const updatePasswordDb = async (newPassword: string): Promise<boolean> => {
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) throw error;
    return true;
};
import { createContext, useState, useEffect, type ReactNode } from "react";
import type { UserResponse } from "../../interfaces/responses/userResponse";
import { getSessionDb } from "../../repositories/auth/auth.repository";
import { getUserByUsernameDb } from "../../repositories/user/user.repository";
import type { UserRole } from "../../types/user.type";
import { supabase } from "../../lib/supabase";
import { signOut } from "../../services/auth/auth.service";

interface AuthContextType {
    user: UserResponse | null;
    login: (userData: UserResponse) => void;
    logout: () => Promise<void>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // recuperar sesion activa al cargar
        const restoreSession = async () => {
            try {
                const session = await getSessionDb();

                if (session) {
                    const username = session.user.email?.replace('@interno.local', '');

                    if (username) {
                        const userData = await getUserByUsernameDb(username);

                        if (userData) {
                            setUser({
                                id: userData.id,
                                name: userData.name,
                                surname: userData.surname,
                                username: userData.username,
                                isActive: userData.is_active,
                                role: userData.role as UserRole
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error al restaurar sesión", error);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();

        // escuchar cambios de sesion
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') setUser(null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = (userData: UserResponse) => {
        setUser(userData);
    };

    // const logout = async () => {

    //     if (user) {
    //         await signOut(user.username);
    //     }
    //     setUser(null);
    // };

    const logout = async () => {
        if (user) {
            await signOut();
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
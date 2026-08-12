import { useState } from "react";
import type { ChangePasswordRequest } from "../../schemas/user.schemas";
import { changePassword } from "../../services/auth/auth.service";

export const useChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updatePassword = async (username: string, data: ChangePasswordRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const success = await changePassword(username, data);
            return success;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error desconocido al cambiar la contraseña";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updatePassword, loading, error, setError };
};
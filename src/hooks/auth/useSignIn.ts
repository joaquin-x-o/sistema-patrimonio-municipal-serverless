import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { LoginRequest } from "../../schemas/user.schemas";
import { signIn } from "../../services/auth/auth.service";
import { useAuth } from "../auth/useAuth";

export const useSignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const executeSignIn = async (data: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await signIn(data.username, data.password);
            login(response.user);

            const from = location.state?.from?.pathname ?? "/";
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al intentar iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return { executeSignIn, loading, error, setError };
};
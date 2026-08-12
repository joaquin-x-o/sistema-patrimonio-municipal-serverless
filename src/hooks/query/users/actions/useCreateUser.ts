import type { CreateUserRequest } from "../../../../schemas/user.schemas";
import { createUser } from "../../../../services/users/user.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(userId: string, data: CreateUserRequest) {
    try {
        return createUser(userId, data);
    } catch (err) {
        if (err instanceof Error && err.message === "El nombre de usuario ya está en uso") {
            throw err;
        }
        console.error("Supabase Auth Error:", err);
        throw new Error("Ocurrió un error al intentar crear el usuario.");
    }
}

export const useCreateUser = () => {
    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Ocurrió un error al intentar crear el usuario."
    );

    return {
        createUser: execute,
        loading,
        error,
        setError
    };
};
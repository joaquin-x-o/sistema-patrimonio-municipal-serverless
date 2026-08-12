import { deleteUser } from "../../../../services/users/user.service";
import { normalizeUsername } from "../../../../utils/user/normalizeUsername";
import { useAuth } from "../../../auth/useAuth";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export const useDeleteUser = () => {
    const { user } = useAuth();

    function action(username: string) {
        const normalizedUsername = normalizeUsername(username);
        return deleteUser(normalizedUsername, user!.id);
    }

    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error desconocido al intentar eliminar el usuario."
    );

    return {
        deleteUser: execute,
        loading,
        error,
        setError
    };
};
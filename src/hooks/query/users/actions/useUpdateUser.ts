import { updateUser } from "../../../../services/users/user.service";
import type { UpdateUserRequest } from "../../../../schemas/user.schemas";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(username: string, request: UpdateUserRequest) {
    return updateUser(username, request);
}

export const useUpdateUser = () => {
    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error desconocido al actualizar el usuario."
    );

    return {
        updateUser: execute,
        loading,
        error,
        setError
    };
};
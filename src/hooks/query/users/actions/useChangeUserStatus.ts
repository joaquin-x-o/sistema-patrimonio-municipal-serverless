import { disableUser, enableUser } from "../../../../services/users/user.service";
import { useAuth } from "../../..//auth/useAuth";
import { useMappedActions } from "../../../common/useMappedActions";

export type UserActionKey = "enable" | "disable";

export const useUserStatus = () => {
    const { user } = useAuth();

    const userActions: Record<UserActionKey, (username: string) => Promise<any>> = {
        enable: (username) => enableUser(username, user!.id),
        disable: (username) => disableUser(username, user!.id)
    };

    const { dispatchAction, loading, error, setError } = useMappedActions(
        userActions,
        "Error al cambiar el estado del usuario."
    );

    return { changeStatus: dispatchAction, loading, error, setError };
};
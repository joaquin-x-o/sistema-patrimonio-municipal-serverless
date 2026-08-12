import { getUserList } from "../../../services/users/user.service";
import { useQuery } from "../../common/useQuery";

function action() {
    return getUserList();
}

export const useUserList = () => {
    const { data, loading } = useQuery(
        action,
        [],
        { errorMessage: "Error al cargar el listado de usuarios." }
    );

    return { data: data ?? [], loading };
};
import { getUserByUsername } from "../../../services/users/user.service";
import { useQuery } from "../../common/useQuery";

export const useUser = (username: string | undefined) => {
    function action() {
        return getUserByUsername(username!);
    }

    // el enabled evita llamadas innecesarias si el username viene vacío o undefined
    return useQuery(
        action,
        [username],
        { enabled: !!username, errorMessage: "Error al cargar el usuario." }
    );
};
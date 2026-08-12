import type { PaginationParams } from "../../../interfaces/params/paginationParams";
import { getUsers } from "../../../services/users/user.service";
import { usePaginatedQuery } from "../../common/usePaginatedQuery";

export const useUsers = (params: PaginationParams = {}) => {
    function action() {
        return getUsers(params);
    }

    //usePaginatedQuery ya escucha automáticamente params.page y params.limit por detrás
    return usePaginatedQuery(action, params);
};
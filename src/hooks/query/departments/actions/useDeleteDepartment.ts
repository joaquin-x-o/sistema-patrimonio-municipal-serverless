import { deleteDepartment } from "../../../../services/departments/department.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(userId: string, departmentCode: string) {
    return deleteDepartment(userId, departmentCode);
}

export const useDeleteDepartment = () => {
    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error al eliminar el área."
    );

    return {
        deleteDepartment: execute,
        loading,
        error,
        setError
    };
};
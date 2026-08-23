import { deleteDepartment } from "../../../../services/departments/department.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(departmentCode: string) {
    return deleteDepartment(departmentCode);
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
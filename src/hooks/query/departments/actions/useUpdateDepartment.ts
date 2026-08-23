import { updateDepartment } from "../../../../services/departments/department.service";
import type { UpdateDepartmentRequest } from "../../../../schemas/department.schemas";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(departmentCode: string, request: UpdateDepartmentRequest) {
    return updateDepartment(departmentCode, request);
}

export const useUpdateDepartment = () => {
    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error desconocido al actualizar el área."
    );

    return {
        updateDepartment: execute,
        loading,
        error,
        setError
    };
};
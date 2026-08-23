import type { CreateDepartmentRequest } from "../../../../schemas/department.schemas";
import { createDepartment } from "../../../../services/departments/department.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

function action(data: CreateDepartmentRequest) {
    return createDepartment(data);
}

export const useCreateDepartment = () => {
    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error desconocido al crear el área."
    );

    return {
        createDepartment: execute,
        loading,
        error,
        setError
    };
};
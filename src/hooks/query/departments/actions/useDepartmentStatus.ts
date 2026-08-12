import { disableDepartment, enableDepartment } from "../../../../services/departments/department.service";
import { useAuth } from "../../../auth/useAuth";
import { useMappedActions } from "../../../common/useMappedActions";

export type DepartmentActionKey = "enable" | "disable";



export const useDepartmentStatus = () => {

    const { user } = useAuth();

    const departmentActions: Record<DepartmentActionKey, (code: string) => Promise<any>> = {
        enable: (code: string) => enableDepartment(user!.id, code),
        disable: (code: string) => disableDepartment(user!.id, code)
    };

    const { dispatchAction, loading, error, setError } = useMappedActions(
        departmentActions,
        "Error al cambiar el estado del área."
    );

    return { changeStatus: dispatchAction, loading, error, setError };
};
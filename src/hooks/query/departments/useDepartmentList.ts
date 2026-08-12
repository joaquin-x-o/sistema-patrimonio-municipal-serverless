import { getDepartmentLightList } from "../../../services/departments/department.service";
import type { DepartmentLightResponse } from "../../../interfaces/responses/departmentResponse";
import { useQuery } from "../../common/useQuery";

const action = async () => {
    return await getDepartmentLightList();
};

export const useDepartmentList = () => {


    const { data, loading, error, refetch } = useQuery<DepartmentLightResponse[]>(
        action,
        [],
        { errorMessage: "Error al cargar la lista de departamentos." }
    );

    return {
        data: data ?? [],
        loading,
        error,
        refetch
    };
};
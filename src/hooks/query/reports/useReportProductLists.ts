import { getMaintenanceProductList } from "../../../services/maintenanceHistory/maintenanceHistory.service";
import { getMovementProductList } from "../../../services/movementHistory/movementHistory.service";
import type { ProductLightResponse } from "../../../interfaces/responses/productResponses";
import { useQuery } from "../../common/useQuery";

interface ReportProductListsData {
    maintenanceList: ProductLightResponse[];
    movementList: ProductLightResponse[];
}

const action = async (): Promise<ReportProductListsData> => {
    const [maintenance, movement] = await Promise.all([
        getMaintenanceProductList(),
        getMovementProductList()
    ]);

    return {
        maintenanceList: maintenance,
        movementList: movement
    };
};

export const useReportProductLists = () => {
    const { data, loading, error, refetch } = useQuery<ReportProductListsData>(
        action,
        [],
        { errorMessage: "Error al cargar las listas de productos para reportes." }
    );

    return {
        maintenanceList: data?.maintenanceList ?? [],
        movementList: data?.movementList ?? [],
        loading,
        error,
        refetch
    };
};
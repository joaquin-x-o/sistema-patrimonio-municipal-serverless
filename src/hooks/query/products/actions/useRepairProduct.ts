import { useAuth } from "../../../auth/useAuth";
import type { RepairProductRequest } from "../../../../schemas/product.schemas";
import { repairProduct } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export const useRepairProduct = () => {
    const { user } = useAuth();

    function action(productCode: string, request: RepairProductRequest) {
        if (!user) {
            throw new Error("No hay un usuario autenticado para registrar la reparación.");
        }
        return repairProduct(productCode, request);
    }

    const { execute, loading, error, setError } = useAsyncMutation(
        action,
        "Error desconocido al procesar la reparación."
    );

    return {
        repairProduct: execute,
        loading,
        error,
        setError
    };
};
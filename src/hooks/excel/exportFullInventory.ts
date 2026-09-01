import { exportFullInventoryWorkbook } from "../../lib/excel/exportFullWorkbook";
import { useAsyncMutation } from "../common/useAsyncMutation";

export function useExportFullInventory() {
  const { execute, loading, error } = useAsyncMutation(
    exportFullInventoryWorkbook,
    "Error al exportar el inventario completo."
  );

  return { handleExportExcel: execute, isExporting: loading, error };
}
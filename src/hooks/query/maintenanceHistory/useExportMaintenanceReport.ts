import { exportWorkbookWithHeader } from "../../../lib/excel/exportWorkbook";
import { getMaintenanceForExportService } from "../../../services/maintenanceHistory/maintenanceHistory.service";
import { useAsyncMutation } from "../../common/useAsyncMutation";

export function useExportMaintenance(productCode: number, productName: string) {
  const { execute, loading, error } = useAsyncMutation(
    async () => {
      const rows = await getMaintenanceForExportService(productCode);
      await exportWorkbookWithHeader({
        rows,
        fileName: `mantenimiento_${productCode}_${productName}`,
        sheetName: "MANTENIMIENTO",
        reportTitle: `HISTORIAL DE MANTENIMIENTO - ${productName.toUpperCase()} (${productCode})`,
        includeYear: false,
      });
    },
    "Error al exportar el historial de mantenimiento."
  );

  return { handleExportExcel: execute, isExporting: loading, error };
}
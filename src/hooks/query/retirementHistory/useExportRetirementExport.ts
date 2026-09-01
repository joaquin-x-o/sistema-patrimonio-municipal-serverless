import { exportWorkbookWithHeader } from "../../../lib/excel/exportWorkbook";
import { getRetirementsForExport } from "../../../services/retirementHistory/retirementHistory.service";
import { useAsyncMutation } from "../../common/useAsyncMutation";

export function useExportRetirements() {
  const { execute, loading, error } = useAsyncMutation(
    async () => {
      const rows = await getRetirementsForExport();
      await exportWorkbookWithHeader({
        rows,
        fileName: "reporte_bajas_patrimonio",
        sheetName: "HISTORIAL BAJAS",
        reportTitle: "HISTORIAL DE BAJAS",
        includeYear: false,
      });
    },
    "Error al exportar el historial de bajas."
  );

  return { handleExportExcel: execute, isExporting: loading, error };
}
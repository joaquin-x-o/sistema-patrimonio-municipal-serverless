import { exportWorkbookWithHeader } from "../../../lib/excel/exportWorkbook";
import { getLossesForExport } from "../../../services/lossHistory/lossHistory.service";
import { useAsyncMutation } from "../../common/useAsyncMutation";

export function useExportLosses() {
  const { execute, loading, error } = useAsyncMutation(
    async () => {
      const rows = await getLossesForExport();
      await exportWorkbookWithHeader({
        rows,
        fileName: "historial_perdidas",
        sheetName: "HISTORIAL PÉRDIDAS",
        reportTitle: "HISTORIAL DE PÉRDIDAS",
        includeYear: false,
      });
    },
    "Error al exportar el historial de pérdidas."
  );

  return { handleExportExcel: execute, isExporting: loading, error };
}
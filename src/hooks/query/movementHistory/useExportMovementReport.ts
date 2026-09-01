import { exportWorkbookWithHeader } from "../../../lib/excel/exportWorkbook";
import { getMovementsForExport } from "../../../services/movementHistory/movementHistory.service";
import { useAsyncMutation } from "../../common/useAsyncMutation";

export function useExportMovements(productCode: number, productName: string) {
  const { execute, loading, error } = useAsyncMutation(
    async () => {
      const rows = await getMovementsForExport(productCode);
      await exportWorkbookWithHeader({
        rows,
        fileName: `traslados_${productCode}_${productName}`,
        sheetName: "TRASLADOS",
        reportTitle: `HISTORIAL DE TRASLADOS - ${productName.toUpperCase()} (${productCode})`,
        includeYear: false,
      });
    },
    "Error al exportar el historial de traslados."
  );

  return { handleExportExcel: execute, isExporting: loading, error };
}
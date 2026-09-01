import { exportWorkbookWithHeader } from "../../../../lib/excel/exportWorkbook";
import { getAllProductsForExcelExport } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export function useExportProducts() {
  const { execute, loading, error } = useAsyncMutation(
    async () => {
      const rows = await getAllProductsForExcelExport();
      await exportWorkbookWithHeader({
        rows,
        fileName: "bienesPatrimonio",
        sheetName: "Bienes Patrimoniales",
        reportTitle: "Bienes Patrimoniales"
      });
    },
    "Error al exportar los productos."
  );

  return { handleExportExcel: execute, isExporting: loading, error };
}
import type { ReviewDisplayProduct } from "../../../../interfaces/responses/productResponses";
import { exportWorkbookWithHeader } from "../../../../lib/excel/exportWorkbook";
import { mapCheckReviewForExport } from "../../../../lib/maps/excel/mapCheckReviewForExport";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export function useExportCheckReview() {
  const { execute, loading, error } = useAsyncMutation(
    async (products: ReviewDisplayProduct[]) => {
      const rows = mapCheckReviewForExport(products);
      await exportWorkbookWithHeader({
        rows,
        fileName: "relevamiento_fisico_pendiente",
        sheetName: "RELEVAMIENTO",
        reportTitle: "PLANILLA DE RELEVAMIENTO FÍSICO",
        includeYear: false,
      });
    },
    "Error al exportar la planilla de relevamiento."
  );

  return { handleExportExcel: execute, isExporting: loading, error };
}
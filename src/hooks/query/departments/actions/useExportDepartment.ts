import { exportWorkbookWithHeader } from "../../../../lib/excel/exportWorkbook";
import { getAllDepartmentsForExport } from "../../../../services/departments/department.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export function useExportDepartments() {
  const { execute, loading, error } = useAsyncMutation(
    async () => {
      const rows = await getAllDepartmentsForExport();
      await exportWorkbookWithHeader({
        rows,
        fileName: "areasPatrimonio",
        sheetName: "ÁREAS",
        reportTitle: "LISTADO DE ÁREAS",
    });
    },
    "Error al exportar las áreas."
  );

  return { handleExportExcel: execute, isExporting: loading, error };
}
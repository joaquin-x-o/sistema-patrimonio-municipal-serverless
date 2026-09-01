import { exportWorkbookWithHeader } from "../../../../lib/excel/exportWorkbook";
import { getDepartmentByCode } from "../../../../services/departments/department.service";
import { getProductsByDepartmentForExport } from "../../../../services/products/product.service";
import { useAsyncMutation } from "../../../common/useAsyncMutation";

export function useExportDepartmentProducts(departmentCode: string) {
  const { execute, loading, error } = useAsyncMutation(
    async () => {
      const [department, rows] = await Promise.all([
        getDepartmentByCode(departmentCode),
        getProductsByDepartmentForExport(departmentCode),
      ]);

      await exportWorkbookWithHeader({
        rows,
        fileName: `${department.departmentCode} ${department.name}`,
        sheetName: department.name.slice(0, 31),
        reportTitle: `${department.name.toUpperCase()} - ${department.responsibleName.toUpperCase()}`,
      });
    },
    "Error al exportar los productos del área."
  );

  return { handleExportExcel: execute, isExporting: loading, error };
}
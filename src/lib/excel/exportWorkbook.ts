import ExcelJS from "exceljs";
import { loadLogoImage, addStyledSheet, downloadWorkbook, type AddStyledSheetOptions } from "../../utils/excelExport/excelExport";

// export de una sola hoja
export async function exportWorkbookWithHeader(
  options: Omit<AddStyledSheetOptions, "logoImageId"> & { fileName: string }
) {
  const workbook = new ExcelJS.Workbook();
  const logoImageId = await loadLogoImage(workbook);
  addStyledSheet(workbook, { ...options, logoImageId });

  const buffer = await workbook.xlsx.writeBuffer();
  downloadWorkbook(buffer, options.fileName);
}
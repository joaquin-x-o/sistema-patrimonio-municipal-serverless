import ExcelJS from "exceljs";

const GOVERNMENT_NAME = import.meta.env.VITE_GOVERNMENT_NAME;
const CURRENT_MANAGEMENT = import.meta.env.VITE_CURRENT_MAYOR;
const PATRIMONY_DIRECTOR = import.meta.env.VITE_CURRENT_PATRIMONY_DIRECTOR;
const LOGO_PATH = import.meta.env.VITE_LOGO;

export interface AddStyledSheetOptions {
  rows: Record<string, unknown>[];
  columns?: string[];
  sheetName: string;
  reportTitle: string;
  includeYear?: boolean;
  logoImageId?: number | null;
}

// agrega una hoja con el mismo diseño institucional a un workbook ya existente
export function addStyledSheet(workbook: ExcelJS.Workbook, options: AddStyledSheetOptions) {
  const { rows, sheetName, reportTitle, includeYear = true, logoImageId } = options;

  const columns = rows.length > 0 ? Object.keys(rows[0]) : (options.columns ?? []);
  if (columns.length === 0) return;

  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ showGridLines: false }],
  });

  const colCount = columns.length;
  const currentYear = new Date().getFullYear();

  let logoRowSpan = 0;

  if (logoImageId !== null && logoImageId !== undefined) {
    const imageWidth = 100;
    const imageHeight = 100;
    const colWidthPx = 126;
    const centerCol = colCount / 2;
    const startCol = centerCol - (imageWidth / 2) / colWidthPx;

    worksheet.addImage(logoImageId, {
      tl: { col: startCol, row: 0.3 },
      ext: { width: imageWidth, height: imageHeight },
    });

    logoRowSpan = 3;
    worksheet.getRow(1).height = 30;
    worksheet.getRow(2).height = 30;
    worksheet.getRow(3).height = 30;
    worksheet.getRow(4).height = 30;
  }

  const titleStartRow = logoRowSpan + 1;

  worksheet.mergeCells(titleStartRow, 1, titleStartRow, colCount);
  worksheet.getRow(titleStartRow).height = 22;
  worksheet.getCell(titleStartRow, 1).value = GOVERNMENT_NAME.toUpperCase();
  worksheet.getCell(titleStartRow, 1).font = { bold: true, size: 14 };
  worksheet.getCell(titleStartRow, 1).alignment = { horizontal: "center" };

  worksheet.mergeCells(titleStartRow + 1, 1, titleStartRow + 1, colCount);
  worksheet.getCell(titleStartRow + 1, 1).value = `GESTIÓN ${CURRENT_MANAGEMENT.toUpperCase()}`;
  worksheet.getCell(titleStartRow + 1, 1).font = { bold: true, size: 12 };
  worksheet.getCell(titleStartRow + 1, 1).alignment = { horizontal: "center" };

  worksheet.mergeCells(titleStartRow + 2, 1, titleStartRow + 2, colCount);
  worksheet.getCell(titleStartRow + 2, 1).value = includeYear
    ? `${reportTitle} AÑO ${currentYear}`
    : reportTitle;
  worksheet.getCell(titleStartRow + 2, 1).font = { bold: true, size: 12 };
  worksheet.getCell(titleStartRow + 2, 1).alignment = { horizontal: "center" };

  worksheet.mergeCells(titleStartRow + 3, 1, titleStartRow + 3, colCount);
  worksheet.getCell(titleStartRow + 3, 1).value = `DIRECTOR DE PATRIMONIO: ${PATRIMONY_DIRECTOR.toUpperCase()}`;
  worksheet.getCell(titleStartRow + 3, 1).font = { bold: true, size: 12 };
  worksheet.getCell(titleStartRow + 3, 1).alignment = { horizontal: "center" };

  worksheet.addRow([]);

const headerRow = worksheet.addRow(columns);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB4C6E7" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" }, bottom: { style: "thin" },
      left: { style: "thin" }, right: { style: "thin" },
    };
  });

  rows.forEach((row) => {
    const dataRow = worksheet.addRow(Object.values(row));
    dataRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" },
      };
    });
  });

  worksheet.columns = columns.map(() => ({ width: 18 }));
}


// carga el logo una vez y devuelve su id para reusar en varias hojas
export async function loadLogoImage(workbook: ExcelJS.Workbook): Promise<number | null> {
  if (!LOGO_PATH) return null;

  const response = await fetch(LOGO_PATH);
  const arrayBuffer = await response.arrayBuffer();
  const extension = LOGO_PATH.split(".").pop()?.toLowerCase();
  const imageExt = extension === "jpg" ? "jpeg" : extension;

  return workbook.addImage({
    buffer: arrayBuffer,
    extension: imageExt as "png" | "jpeg" | "gif",
  });
}

export function downloadWorkbook(buffer: ExcelJS.Buffer, fileName: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}

import ExcelJS from "exceljs";
import { getDepartmentsDb } from "../../repositories/departments/department.repository";
import { addStyledSheet, loadLogoImage } from "../../utils/excelExport/excelExport";
import type { DepartmentWithCountRow } from "../../interfaces/responses/departmentResponse";
import type { ProductExportRow } from "../../interfaces/responses/productResponses";
import { getProductsForExportDb } from "../../repositories/products/products.repository";
import { mapProductsForExport } from "../maps/excel/mapProductsForExport";

// export de todo el inventario, con una hoja por cada departamento
export async function exportFullInventoryWorkbook() {
  const [allProducts, departments] = await Promise.all([
    getProductsForExportDb(), // datos crudos, sin mapear a columnas
    getDepartmentsDb(),
  ]);

  const workbook = new ExcelJS.Workbook();
  const logoImageId = await loadLogoImage(workbook);

  const allProductsRows = mapProductsForExport(allProducts);
  const productColumns = allProductsRows.length > 0 ? Object.keys(allProductsRows[0]) : [];

  addGeneralSheet(workbook, allProductsRows, productColumns, logoImageId);
  addDepartmentSheets(workbook, departments, allProducts, productColumns, logoImageId);

  const buffer = await workbook.xlsx.writeBuffer();
  const currentYear = new Date().getFullYear();
  downloadWorkbook(buffer, `patrimonio_municipal_${currentYear}.xlsx`);
}


// HELPERS

function sanitizeSheetName(name: string): string {
  return name.replace(/[:\\/?*[\]]/g, "").slice(0, 31);
}

// evita nombres de hoja repetidos si dos áreas truncan al mismo nombre
function buildUniqueSheetName(baseName: string, usedNames: Set<string>): string {
  let sheetName = sanitizeSheetName(baseName);
  let suffix = 1;

  while (usedNames.has(sheetName)) {
    sheetName = sanitizeSheetName(`${baseName} (${++suffix})`);
  }

  usedNames.add(sheetName);
  return sheetName;
}

// arma la hoja general con todos los productos (ya mapeados)
function addGeneralSheet(
  workbook: ExcelJS.Workbook,
  allProductsRows: Record<string, unknown>[],
  productColumns: string[],
  logoImageId: number | null
) {
  addStyledSheet(workbook, {
    rows: allProductsRows,
    columns: productColumns,
    sheetName: "PATRIMONIO MUNICIPAL",
    reportTitle: "INVENTARIO GENERAL",
    logoImageId,
  });
}

// arma una hoja por cada área, filtrando sobre el dato crudo y mapeando recién acá
function addDepartmentSheets(
  workbook: ExcelJS.Workbook,
  departments: DepartmentWithCountRow[],
  allProducts: ProductExportRow[],
  productColumns: string[],
  logoImageId: number | null
) {
  const usedSheetNames = new Set<string>();

  for (const dept of departments) {
    const productsInArea = allProducts.filter((p) => p.department?.code === dept.code);
    const mappedProductsInArea = mapProductsForExport(productsInArea);

    const sheetName = buildUniqueSheetName(`${dept.code} ${dept.name}`, usedSheetNames);
    const responsible = dept.responsible_name?.toUpperCase() ?? "SIN RESPONSABLE";

    addStyledSheet(workbook, {
      rows: mappedProductsInArea,
      columns: productColumns,
      sheetName,
      reportTitle: `${dept.name.toUpperCase()} - ${responsible}`,
      includeYear: false,
      logoImageId,
    });
  }
}

// descarga el workbook generado como archivo .xlsx
function downloadWorkbook(buffer: ExcelJS.Buffer, fileName: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
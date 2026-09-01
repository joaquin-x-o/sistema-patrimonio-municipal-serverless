import type { ProductExportRow } from "../../../interfaces/responses/productResponses";
import { formatAreaCode } from "../../../utils/common/formatAreaCode";
import { formatDateAR } from "../../../utils/date/formattedDate";
import { conditionTranslations } from "../../../utils/dictionaries/productDictionaries";

export function mapProductsForExport(products: ProductExportRow[]) {
  return products.map((p) => ({
    "Código": p.code,
    "Área": p.department?.code
      ? formatAreaCode(p.department.code, p.is_legacy)
      : "Sin asignar",
    "Cantidad": p.quantity,
    "Nombre": p.name,
    "Descripción": p.description ?? "",
        "Estado": p.physical_condition
      ? conditionTranslations[p.physical_condition]
      : "No especificado",
    "Fecha de alta": formatDateAR(p.registration_date),
    "Facturación": p.invoice_number ?? "",
    "Valor": p.purchase_price ?? "",
    "Depreciación": p.depreciation ?? "",
    "Observaciones": p.observation ?? "",
  }));
}
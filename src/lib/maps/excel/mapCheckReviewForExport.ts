import type { ReviewDisplayProduct } from "../../../interfaces/responses/productResponses";
import { formatDateAR } from "../../../utils/date/formattedDate";

export function mapCheckReviewForExport(products: ReviewDisplayProduct[]) {
  return products.map((p) => ({
    "Código": p.productCode,
    "Nombre": p.name,
    "Ubicación actual": `${p.department.name} (${p.department.departmentCode})`,
    "Última constatación": formatDateAR(p.lastCheckDate),
    "Encontrado": "",
  }));
}
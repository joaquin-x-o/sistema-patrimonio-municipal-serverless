import type { RetirementExportRow } from "../../../interfaces/responses/retirementHistoryResponse";
import { formatDateAR } from "../../../utils/date/formattedDate";
import { retirementTypeTranslation } from "../../../utils/dictionaries/retirementTypeDictionary";

export function mapRetirementsForExport(retirements: RetirementExportRow[]) {
  return retirements.map((r) => ({
    "Fecha de baja": formatDateAR(r.date),
    "Resolución": r.doc_reference ?? "No especificado",
    "Código del producto": r.product?.code ?? "",
    "Área": r.product?.department?.code ?? "Sin asignar",
    "Nombre del producto": r.product?.name ?? "",
    "Motivo": r.reason ?? "No especificado",
    "Tipo de baja": retirementTypeTranslation[r.type] ?? r.type,
    "Registrado por": r.user ? `${r.user.name} ${r.user.surname}` : "No especificado",
  }));
}
import type { LossExportRow } from "../../../interfaces/responses/lossHistoryResponse";
import { formatDateAR } from "../../../utils/date/formattedDate";
import { lossTypeTranslation } from "../../../utils/dictionaries/lossTypeDictionary";
import { statusTranslations } from "../../../utils/dictionaries/productDictionaries";


export function mapLossesForExport(losses: LossExportRow[]) {
  return losses.map((l) => ({
    "Fecha de pérdida": formatDateAR(l.date),
    "Denuncia": l.complaint_reference ?? "No especificado",
    "Código del producto": l.product?.code ?? "",
    "Área": l.department?.code ?? "Sin asignar",
    "Nombre del producto": l.product?.name ?? "",
    "Detalles de la pérdida": l.details ?? "No especificado",
    "Tipo de pérdida": lossTypeTranslation[l.type] ?? l.type,
    "Estado actual": l.product?.status
      ? statusTranslations[l.product.status]
      : "No especificado",
    "Registrado por": l.user ? `${l.user.name} ${l.user.surname}` : "No especificado",
  }));
}
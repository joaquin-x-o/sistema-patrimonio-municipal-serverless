import type { MaintenanceExportRow } from "../../../interfaces/responses/maintenanceHistoryResponse";
import { formatPrice } from "../../../utils/common/priceFormatters";
import { formatDateAR } from "../../../utils/date/formattedDate";

export function mapMaintenanceForExport(records: MaintenanceExportRow[]) {
  return records.map((m) => ({
    "Fecha de avería": formatDateAR(m.unusable_date),
    "Motivo de avería": m.breakdown_reason ?? "No especificado",
    "Fecha de reparación": formatDateAR(m.repair_date),
    "Reparación": m.repair_description ?? "No especificado",
    "Costo": formatPrice(m.cost) ?? "No especificado",
    "Registrado por": m.user ? `${m.user.name} ${m.user.surname}` : "No especificado",
  }));
}
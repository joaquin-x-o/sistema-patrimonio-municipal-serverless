import type { MovementExportRow } from "../../../interfaces/responses/movementHistoryResponse";
import { formatDateAR } from "../../../utils/date/formattedDate";

export function mapMovementsForExport(movements: MovementExportRow[]) {
  return movements.map((m) => ({
    "Fecha de traslado": formatDateAR(m.date),
    "Área origen": m.origin
      ? `${m.origin.name} (${m.origin.code})`
      : "No especificado",
    "Área destino": m.destination
      ? `${m.destination.name} (${m.destination.code})`
      : "No especificado",
    "Motivo": m.reason ?? "No especificado",
    "Registrado por": m.user ? `${m.user.name} ${m.user.surname}` : "No especificado",
  }));
}
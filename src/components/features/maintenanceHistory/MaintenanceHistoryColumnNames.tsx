import type { ColumnDef } from "../../../interfaces/columnDef";
import type { MaintenanceHistoryResponse } from "../../../interfaces/responses/maintenanceHistoryResponse";
import { formatPrice } from "../../../utils/common/priceFormatters";
import { formatCalendarDateAR } from "../../../utils/date/formattedDate";


export const MaintenanceHistoryColumnNames: ColumnDef<MaintenanceHistoryResponse>[] = [
    {
        header: "Fecha de avería",
        accessorKey: "unusableDate",
        cell: (row) => `${formatCalendarDateAR(row.unusableDate)}`
    },
    {
        header: "Motivo de avería",
        accessorKey: "breakdownReason",
    },
    {
        header: "Fecha de reparación",
        accessorKey: "repairDate",
        cell: (row) => `${formatCalendarDateAR(row.repairDate)}`
    },
    {
        header: "Reparación",
        accessorKey: "repairDescription",
    },
    {
        header: "Costo",
        accessorKey: "cost",
        cell: (row) => `$${formatPrice(row.cost)}`
    },
    {
        header: "Registrado por",
        accessorKey: "user",
        cell: (row) => `${row.user.name} ${row.user.surname}`

    }
];
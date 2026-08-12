import type { ColumnDef } from "../../../interfaces/columnDef";
import { formatDateTimeAR } from "../../../utils/date/formattedDate";
import { Badge } from "../../ui/DataDisplay/Badge";
import type { LogResponse } from "../../../interfaces/responses/logHistoryResponse";
import { actionTypeTranslation, entityTypeTranslation } from "../../../utils/dictionaries/logDictionaries";
import { formatLogData } from "../../../lib/logMessage/formatLogData";

export const LogHistoryColumnNames: ColumnDef<LogResponse>[] = [
    {
        header: "Fecha y hora",
        accessorKey: "timestamp",
        cell: (row) => row.timestamp ? formatDateTimeAR(row.timestamp) : "-"
    },
    {
        header: "Acción",
        accessorKey: "action",
        cell: (row) => <Badge color="warning">{actionTypeTranslation[row.action] || row.action}</Badge>
    },
    {
        header: "Entidad",
        accessorKey: "entityType",
        cell: (row) => entityTypeTranslation[row.entityType] || row.entityType
    },
    {
        header: "Código",
        accessorKey: "entityCode"
    },
    {
        header: "Descripción",
        accessorKey: "description"
    },
    {
        header: "Antes",
        accessorKey: "oldData",
        cell: (row) => formatLogData(row.action, row.oldData)
    },
    {
        header: "Después",
        accessorKey: "newData",
        cell: (row) => formatLogData(row.action, row.newData)

    },
    {
        header: "Registrado por",
        accessorKey: "user",
        cell: (row) => row.user ? `${row.user.name} ${row.user.surname}` : "-"
    }
];
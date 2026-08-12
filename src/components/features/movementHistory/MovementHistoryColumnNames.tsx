import type { ColumnDef } from "../../../interfaces/columnDef";
import { formatCalendarDateAR } from "../../../utils/date/formattedDate";
import type { MovementHistoryResponse } from "../../../interfaces/responses/movementHistoryResponse";
import { DepartmentNameFormat } from "../departments/DepartmentNameFormat";

export const MovementHistoryColumnNames: ColumnDef<MovementHistoryResponse>[] = [
    {
        header: "Fecha de traslado",
        accessorKey: "transferDate",
        cell: (row) => `${formatCalendarDateAR(row.transferDate)}`
    },
    {
        header: "Área origen",
        accessorKey: "originDepartment",
        cell: (row) => (
            <DepartmentNameFormat
                departmentCode={row.originDepartment.departmentCode}
                name={row.originDepartment.name}
            />
        )
    },
    {
        header: "Área destino",
        accessorKey: "destinationDepartment",
        cell: (row) => (
            <DepartmentNameFormat
                departmentCode={row.destinationDepartment.departmentCode}
                name={row.destinationDepartment.name}
            />
        )
    },
    {
        header: "Motivo",
        accessorKey: "reasonForMovement"
    },
    {
        header: "Registrado por",
        accessorKey: "user",
        cell: (row) => `${row.user.name} ${row.user.surname}`

    }
];
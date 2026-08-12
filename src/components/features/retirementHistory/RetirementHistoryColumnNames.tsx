import type { ColumnDef } from "../../../interfaces/columnDef";
import type { RetirementHistoryResponse } from "../../../interfaces/responses/retirementHistoryResponse";
import { retirementTypeTranslation } from "../../../utils/dictionaries/retirementTypeDictionary";
import { formatCalendarDateAR } from "../../../utils/date/formattedDate";
import { Badge } from "../../ui/DataDisplay/Badge";
import { DepartmentNameFormat } from "../departments/DepartmentNameFormat";
import { LinkButton } from "../../ui/Button/LinkButton";

export const RetirementHistoryColumnNames: ColumnDef<RetirementHistoryResponse>[] = [
    {
        header: "Fecha de baja",
        accessorKey: "transactionDate",
        cell: (row) => `${formatCalendarDateAR(row.transactionDate)}`
    },
    {
        header: "Resolución",
        accessorKey: "documentReference"
    },
    {
        header: "Código del producto",
        accessorKey: "product",
        cell: (row) => `${row.product.productCode}`
    },
    {
        header: "Área",
        accessorKey: "department",
        cell: (row) => (
            <DepartmentNameFormat
                departmentCode={row.department.departmentCode}
                name={row.department.name}
            />
        )
    },
    {
        header: "Nombre del producto",
        accessorKey: "product",
        cell: (row) => `${row.product.name}`
    },

    {
        header: "Motivo",
        accessorKey: "retirementReason"
    },
    {
        header: "Tipo de baja",
        accessorKey: "retirementType",
        cell: (row) => <Badge color="danger">{retirementTypeTranslation[row.retirementType] || row.retirementType}</Badge>
    },
    {
        header: "Registrado por",
        accessorKey: "user",
        cell: (row) => `${row.user.name} ${row.user.surname}`
    },
    {
        header: "",
        accessorKey: "product",
        cell: (row) => (
            <div className="flex justify-center">
                <LinkButton variant="primary" to={`/producto/${row.product.productCode}`}
                    className="px-3 py-1.5 text-xs"
                >
                    Ver
                </LinkButton>
            </div>
        )
    }
];
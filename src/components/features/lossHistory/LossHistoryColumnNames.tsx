import type { ColumnDef } from "../../../interfaces/columnDef";
import { formatCalendarDateAR } from "../../../utils/date/formattedDate";
import { Badge } from "../../ui/DataDisplay/Badge";
import { DepartmentNameFormat } from "../departments/DepartmentNameFormat";
import type { LossHistoryResponse } from "../../../interfaces/responses/lossHistoryResponse";
import { lossTypeTranslation } from "../../../utils/dictionaries/lossTypeDictionary";
import { ProductBadgeStatus } from "../products/status/ProductBadgeStatus";

export const LossHistoryColumnNames: ColumnDef<LossHistoryResponse>[] = [
    {
        header: "Fecha de pérdida",
        accessorKey: "lossDate",
        cell: (row) => `${formatCalendarDateAR(row.lossDate)}`
    },
    {
        header: "Denuncia",
        accessorKey: "complaintReference"
    },
    {
        header: "Código del producto",
        accessorKey: "product",
        cell: (row) => `${row.product.productCode}`
    },
    {
        header: "Área",
        accessorKey: "lastSeenDepartment",
        cell: (row) => (
            <DepartmentNameFormat
                departmentCode={row.lastSeenDepartment.departmentCode}
                name={row.lastSeenDepartment.name}
            />
        )
    },
    {
        header: "Nombre del producto",
        accessorKey: "product",
        cell: (row) => `${row.product.name}`
    },

    {
        header: "Detalles de la pérdida",
        accessorKey: "lossDetails"
    },
    {
        header: "Tipo de pérdida",
        accessorKey: "lossType",
        cell: (row) => <Badge color="warning">{lossTypeTranslation[row.lossType] || row.lossType}</Badge>
    },
    {
        header: "Estado actual",
        accessorKey: "product",
        cell: (row) => <ProductBadgeStatus status={row.product.status} />
    },
    {
        header: "Registrado por",
        accessorKey: "user",
        cell: (row) => `${row.user.name} ${row.user.surname}`
    }
];
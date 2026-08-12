import type { ColumnDef } from "../../../interfaces/columnDef";
import type { ProductShortResponse } from "../../../interfaces/responses/productResponses";
import { LinkButton } from "../../ui/Button/LinkButton";
import { categoryTranslations, conditionTranslations } from "../../../utils/dictionaries/productDictionaries";
import { ProductBadgeStatus } from "./status/ProductBadgeStatus";
import { DepartmentNameFormat } from "../departments/DepartmentNameFormat";
import { formatDateAR } from "../../../utils/date/formattedDate";


export const ProductColumnNames: ColumnDef<ProductShortResponse>[] = [
    {
        header: "Código",
        accessorKey: "productCode"
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
        header: "Nombre",
        accessorKey: "name"
    },
    {
        header: "Categoría",
        accessorKey: "category",
        cell: (row) => categoryTranslations[row.category] || row.category
    },
    {
        header: "Condición",
        accessorKey: "physicalCondition",
        cell: (row) => conditionTranslations[row.physicalCondition] || row.physicalCondition
    },
    {
        header: "Fecha de registro",
        accessorKey: "registrationDate",
        cell: (row) => `${formatDateAR(row.registrationDate)}`
    },
    {
        header: "Estado",
        accessorKey: "status",
        cell: (row) => <ProductBadgeStatus status={row.status} />
    },
    {
        header: "",
        accessorKey: "productCode",
        cell: (row) => (
            <div className="flex justify-center">
                <LinkButton variant="primary" to={`/producto/${row.productCode}`}
                    className="px-3 py-1.5 text-xs"
                >
                    Ver
                </LinkButton>
            </div>
        )
    }
];
import type { ColumnDef } from "../../../interfaces/columnDef";

import type { UserResponse } from "../../../interfaces/responses/userResponse";
import { LinkButton } from "../../ui/Button/LinkButton";
import { UserBadgeStatus, UserRoleBadge } from "./userBadge";

export const UserColumnNames: ColumnDef<UserResponse>[] = [
    {
        header: "Nombre",
        accessorKey: "name"
    },
    {
        header: "Apellido",
        accessorKey: "surname"
    },
    {
        header: "Usuario",
        accessorKey: "username"
    },
    {
        header: "Rol",
        accessorKey: "role",
        cell: (row) => <UserRoleBadge role={row.role!} />
    },
    {
        header: "Estado",
        accessorKey: "isActive",
        cell: (row) => <UserBadgeStatus status={row.isActive} />
    },
    {
        header: "",
        accessorKey: "username",
        cell: (row) => (
            <div className="flex justify-end">
                <LinkButton
                    to={`/usuario/${row.username}`}
                    variant="primary"
                    className="px-6 py-1 text-xs"
                >
                    Ver
                </LinkButton>
            </div>
        )
    }
];
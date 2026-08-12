import { Badge } from "../../ui/DataDisplay/Badge";
import { UserRole } from "../../../types/user.type";
import { userRoleTranslation } from "../../../utils/dictionaries/userDictionary";

interface RoleProps {
    role: UserRole;
}

export function UserRoleBadge({ role }: RoleProps) {
    let badgeColor: "success" | "danger" | "warning" | "default" = "default";

    if (role === UserRole.ADMIN) {
        badgeColor = "success";
    } else if (role === UserRole.VIEWER) {
        badgeColor = "default";
    }

    return (
        <Badge color={badgeColor}>
            {userRoleTranslation[role]}
        </Badge>
    );
}


interface StatusProps {
    status: boolean;
}

export function UserBadgeStatus({ status }: StatusProps) {
    let badgeColor: "success" | "danger" | "warning" | "default" = "default";

    if (status) {
        badgeColor = "success";
        return (
            <Badge color={badgeColor}>
                Activo
            </Badge>
        );
    } else {
        return (
            <Badge color={badgeColor}>
                Inactivo
            </Badge>
        );
    }

}
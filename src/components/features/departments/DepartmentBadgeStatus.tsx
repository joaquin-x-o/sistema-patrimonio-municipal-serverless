import { Badge } from "../../ui/DataDisplay/Badge";

interface Props {
    status: boolean;
}

export function DepartmentBadgeStatus({ status }: Props) {
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
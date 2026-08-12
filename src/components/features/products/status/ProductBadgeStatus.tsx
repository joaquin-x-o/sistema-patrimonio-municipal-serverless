import { Badge } from "../../../ui/DataDisplay/Badge";
import { ProductStatus } from "../../../../types/product.type";
import { statusTranslations } from "../../../../utils/dictionaries/productDictionaries";

interface Props {
    status: ProductStatus;
}

export function ProductBadgeStatus({ status }: Props) {
    let badgeColor: "success" | "danger" | "warning" | "default" = "default";

    if (status === ProductStatus.ACTIVE) {
        badgeColor = "success";
    } else if (status === ProductStatus.RETIRED) {
        badgeColor = "danger";
    } else if (status === ProductStatus.IN_REVIEW || status === ProductStatus.LOST) {
        badgeColor = "warning";
    }

    return (
        <Badge color={badgeColor}>
            {statusTranslations[status]}
        </Badge>
    );
}
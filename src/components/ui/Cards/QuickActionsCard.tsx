import { useSidebar } from "../../layout/sidebar/SidebarProvider";
import { QuickActionButtonsGroup, type ButtonGroupAction } from "../Button/ButtonGroup";
import { Card } from "../Common/Card";

interface Props {
    actions: ButtonGroupAction[];
    sidebarKey?: string;
    className?: string;
    onFooterClick?: () => void;
}

// card que contiene los botones de acciones rapidas
export function QuickActionsCard({ actions, sidebarKey, className, onFooterClick }: Props) {
    const { toggleMenu } = useSidebar();

    const handleFooterClick = onFooterClick ?? (() => sidebarKey && toggleMenu(sidebarKey));

    return (
        <Card title="ACCIONES RÁPIDAS" onFooterClick={handleFooterClick} centerTitle={true} className={className}>
            <QuickActionButtonsGroup actions={actions} />
        </Card>
    );
}
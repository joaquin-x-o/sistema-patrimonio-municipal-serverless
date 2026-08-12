import type { ReactNode } from "react";
import { LinkButton } from "../Button/LinkButton";
import type { ButtonVariant } from "./buttonStyles";

export interface ButtonGroupAction {
    label: string;
    to: string;
    variant?: ButtonVariant;
    className?: string;
    icon?: ReactNode;
}

interface Props {
    actions: ButtonGroupAction[];
}

// grupo de botones para acciones rapidas
export function QuickActionButtonsGroup({ actions }: Props) {
    return (
        <div className="flex flex-col gap-3 py-2">
            {actions.map((action) => (
                <LinkButton key={action.to} variant={action.variant} to={action.to} className={`w-full py-3 ${action.className}`}>
                    {action.label}
                </LinkButton>
            ))}
        </div>
    );
}
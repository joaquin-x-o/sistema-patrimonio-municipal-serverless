import type { ReactNode } from "react";

import { LinkButton } from "./LinkButton";
import type { ButtonVariant } from "./buttonStyles";
import { Button } from "../Common/Button";

interface Props {
    icon: ReactNode;
    className?: string;
    variant?: ButtonVariant;
    to?: string;
    state?: unknown;
    onClick?: () => void;
}

export function IconButton({ to, icon, state, className = "", variant = "invisible", onClick }: Props) {
    if (to) {
        return (
            <LinkButton variant={variant} className={className} to={to} state={state}>
                {icon}
            </LinkButton>
        );
    }

    return (
        <Button variant={variant} className={className} onClick={onClick}>
            {icon}
        </Button>
    );
}
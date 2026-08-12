import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getButtonStyles, type ButtonVariant } from "./buttonStyles";

interface Props {
    children?: ReactNode;
    variant?: ButtonVariant;
    className?: string;
    icon?: ReactNode;
    to: string;
    state?: unknown;
}

export function LinkButton({ children, variant, className, icon, to, state }: Props) {
    return (
        <Link to={to} state={state} className={getButtonStyles(variant, className)}>
            {icon && <span>{icon}</span>}
            {children}
        </Link>
    );
}
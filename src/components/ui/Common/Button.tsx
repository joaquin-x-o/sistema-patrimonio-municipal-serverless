import type { ReactNode } from "react";
import { getButtonStyles, type ButtonVariant } from "../Button/buttonStyles";

interface Props {
    children?: ReactNode;
    variant?: ButtonVariant;
    className?: string;
    icon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export function Button({ children, variant, className, icon, onClick, disabled, type = "button" }: Props) {
    return (
        <button
            type={type}
            className={`disabled:opacity-50 disabled:pointer-events-none ${getButtonStyles(variant, className)}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}
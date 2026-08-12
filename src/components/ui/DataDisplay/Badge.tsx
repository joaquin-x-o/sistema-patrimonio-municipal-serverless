import type { ReactNode } from "react";

type BadgeVariant = "success" | "danger" | "warning" | "default";

interface BadgeProps {
    children: ReactNode;
    color?: BadgeVariant;
    className?: string;
}

export function Badge({ children, color = "default", className = "" }: BadgeProps) {
    const baseStyles = "px-3 py-1 rounded-sm text-xs font-semibold inline-flex items-center justify-center";

    const variantStyles: Record<BadgeVariant, string> = {
        success: "bg-success text-foreground",     // verde para "Activo"
        danger: "bg-danger text-foreground",        // rojo para "Baja"
        warning: "bg-warning text-foreground",     // naranja/Amarillo para "Pendiente, En revisión o Perdido"
        default: "bg-neutral text-foreground"    // gris para "En desuso"
    };

    return (
        <span className={`${baseStyles} ${variantStyles[color]} ${className}`}>
            {children}
        </span>
    );
}
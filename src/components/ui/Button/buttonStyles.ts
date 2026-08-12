
// variantes de botones disponibles
export type ButtonVariant = "primary" | "danger" | "warning" | "success" | "neutral" | "invisible" | "outlinePrimary";

// estilo base para todos los botones
const baseStyles = "flex items-center justify-center gap-2 px-4 py-2 rounded-md text-lg font-medium transition-all cursor-pointer active:scale-95 shadow-sm";

// estilos especificos para cada variante de botón
const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary-hover text-foreground hover:opacity-90",
    danger: "bg-danger text-foreground hover:opacity-90",
    warning: "bg-warning text-foreground hover:opacity-90",
    success: "bg-success text-foreground hover:opacity-90",
    neutral: "bg-neutral text-foreground hover:opacity-90",
    invisible: "bg-transparent text-foreground-muted hover:text-primary",
    outlinePrimary: "bg-transparent border border-primary-hover text-primary-hover hover:bg-primary-hover hover:text-foreground cursor-pointer"
};

// obtiene las clases combinadas para un botón dado su variante y clases adicionales
export const getButtonStyles = (variant: ButtonVariant = "primary", className = "") =>
    `${baseStyles} ${variantStyles[variant]} ${className}`;
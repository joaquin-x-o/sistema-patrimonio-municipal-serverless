interface Props {
    label: string;
    children: React.ReactNode;
    align?: "center" | "start";
}

// campo de formulario con su label e input
export function FormField({ label, children, align = "center" }: Props) {
    return (
        <div className={`grid grid-cols-[150px_1fr] items-${align}`}>
            <label className="text-sm font-medium text-foreground-muted text-left">
                {label}:
            </label>
            {/* El input sera pasado como children debido a que pueden ser de diferentes tipos */}
            {children}
        </div>
    );
}
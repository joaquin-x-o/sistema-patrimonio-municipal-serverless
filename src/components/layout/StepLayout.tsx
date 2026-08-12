interface Props {
    children: React.ReactNode;
    variant?: "search" | "form" | "success";
}

// layouts para los pasos del wizard (form de busqueda, form de datos y card de success)
export const StepLayout = ({ children, variant = "form" }: Props) => {
    const baseStyles = {
        search: "flex flex-col items-center",
        form: "mt-8",
        success: "text-center mt-8",
    };

    return (
        <div className={baseStyles[variant]}>
            {children}
        </div>
    );
};
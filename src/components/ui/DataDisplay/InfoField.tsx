interface Props {
    label: string;
    value?: React.ReactNode;
}

// muestra un label + value para mostrar informacion dentro de cards o secciones
export function InfoField({ label, value }: Props) {
    return (
        <p className="wrap-break-word min-w-0 text-foreground-muted">
            <span className="font-bold text-foreground-muted">{label}: </span>
            {value}
        </p>
    );
}
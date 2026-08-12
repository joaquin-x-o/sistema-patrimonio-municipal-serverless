import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

// titulo para mensajes de resultado o estado de una acción
export function ResultTitle({ children }: Props) {
    return (
        <h2 className="text-lg font-semibold text-foreground-muted">
            {children}
        </h2>
    );
}
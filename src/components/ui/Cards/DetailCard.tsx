import { SquarePen } from "lucide-react";
import { IconButton } from "../Button/IconButton";
import { Card } from "../Common/Card";
import { InfoField } from "../DataDisplay/InfoField";

interface Props {
    label?: string;
    value?: React.ReactNode;
    onEdit?: () => void;
    showEdit?: boolean;
    icon?: React.ReactNode;
    className?: string;
    extra?: React.ReactNode;
    title?: string;
    centerTitle?: boolean;
    children?: React.ReactNode;
}

export function DetailCard({ label, value, onEdit, showEdit = true, icon = <SquarePen size={24} strokeWidth={1.5} />, className, extra, title, centerTitle, children }: Props) {
    return (
        <Card title={title} centerTitle={centerTitle} className={className}>
            <div className="relative">
                {/* si hay children, se asume que hay mas de un campo de detalles dentro de la card por lo que se muestra en modo grid */}
                {/* si no hay children, el campo se muestra en una sola fila al asumir que es solo un campo de detalle dentro de la card */}
                {children ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                        {children}
                    </div>
                ) : (
                    <div className="flex justify-between items-center text-foreground-muted">
                        <InfoField label={label!} value={value} />
                        {showEdit && onEdit && (
                            <IconButton onClick={onEdit} icon={<SquarePen size={24} strokeWidth={1.5} />} />
                        )}
                    </div>
                )}
                {showEdit && onEdit && children && (
                    <IconButton
                        className="absolute bottom-0 right-0 p-2"
                        onClick={onEdit}
                        icon={icon}
                    />
                )}
                {extra}
            </div>
        </Card>
    );
}
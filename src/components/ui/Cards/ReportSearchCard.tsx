import { HelpButton } from "../Button/HelpButton";
import { Button } from "../Common/Button";
import { Card } from "../Common/Card";
import { Input } from "../Input/Input";

interface ReportSearchCardProps {
    title: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    onOpenModal: () => void;
}

export function ReportSearchCard({ title, value, onChange, onSubmit, onOpenModal }: ReportSearchCardProps) {
    return (
        <Card title={title}>
            <div className="flex flex-col gap-4">
                <p className="text-lg text-foreground-muted">
                    Escriba el código del producto al que quiere ver su reporte:
                </p>
                <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-4">
                    <div className="w-64">
                        <Input
                            id={`input-${title}`}
                            type="text"
                            placeholder="Ej: 101"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </div>
                    <HelpButton onClick={onOpenModal}>Ver productos</HelpButton>
                    <Button variant="neutral" className="text-sm py-2" onClick={() => onChange("")} disabled={!value}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" className="text-sm py-2" disabled={!value}>
                        Ver reporte
                    </Button>
                </form>
            </div>
        </Card>
    );
}
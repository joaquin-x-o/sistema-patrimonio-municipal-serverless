import { Button } from "../Common/Button";

// botones para manejo de filtros (aplicar y limpiar)
interface Props {
    onApply: () => void;
    onClear: () => void;
}

export function FilterActions({ onApply, onClear }: Props) {
    return (
        <div className="col-span-full flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4 pt-4">
            <Button
                variant="outlinePrimary"
                onClick={onClear}
                className="w-full sm:w-auto text-sm cursor-pointer"
            >
                Limpiar
            </Button>
            <Button
                variant="outlinePrimary"
                onClick={onApply}
                className="w-full sm:w-auto text-sm cursor-pointer"
            >
                Aplicar Filtros
            </Button>
        </div>
    );
}
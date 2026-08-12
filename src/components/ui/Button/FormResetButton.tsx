import { Button } from "../Common/Button";

interface Props {
    isDirty: boolean;
    disabled: boolean;
    onReset: () => void;
}

export function FormResetButton({ isDirty, disabled, onReset }: Props) {
    if (!isDirty) return null;

    return (
        <div className="flex justify-end">
            <Button
                type="button"
                variant="outlinePrimary"
                className="text-sm"
                disabled={disabled}
                onClick={onReset}
            >
                Deshacer cambios
            </Button>
        </div>
    );
}
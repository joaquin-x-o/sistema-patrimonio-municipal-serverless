import { Eye, EyeOff } from "lucide-react";
import { Button } from "../Common/Button";

interface Props {
    isVisible: boolean;
    disabled: boolean;
    onToggle: () => void;
}

export function PasswordToggleButton({ isVisible, disabled, onToggle }: Props) {
    return (
        <Button
            type="button"
            variant="invisible"
            className="p-2 text-foreground-muted hover:text-primary transition-colors"
            disabled={disabled}
            onClick={onToggle}
        >
            {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
    );
}
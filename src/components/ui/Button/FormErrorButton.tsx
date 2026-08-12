import { useNavigate } from "react-router-dom";
import { Button } from "../Common/Button";

interface Props {
    label: string;
    navigateTo: string;
    navigationState: Record<string, any>;
    disabled?: boolean;
}

export function FormErrorButton({
    label,
    navigateTo,
    navigationState,
    disabled = false
}: Props) {
    const navigate = useNavigate();

    return (
        <Button
            type="button"
            variant="primary"
            className="text-sm px-8"
            disabled={disabled}
            onClick={() => navigate(navigateTo, { state: navigationState })}
        >
            {label}
        </Button>
    );
}
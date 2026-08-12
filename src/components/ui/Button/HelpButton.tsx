import type { ReactNode } from "react";
import { Button } from "../Common/Button";
import { CircleQuestionMarkIcon } from "lucide-react";

interface Props {
    onClick: () => void;
    className?: string;
    showHelpIcon?: boolean
    children: ReactNode;
}

export function HelpButton({
    onClick,
    className = "",
    showHelpIcon = true,
    children
}: Props) {
    return (
        <Button
            variant="invisible"
            className={`p-2 text-sm flex items-center gap-2 hover:bg-foreground-muted/5 ${className}`}
            onClick={onClick}
        >
            {showHelpIcon && <CircleQuestionMarkIcon size={20} />}
            {children}
        </Button>
    );
}
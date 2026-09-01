import { FileSpreadsheet, Loader2 } from "lucide-react";
import { useSidebar } from "./SidebarProvider";

interface Props {
    text: string;
    onClick: () => void;
    isLoading?: boolean;
}

export function SidebarExcelButton({ text, onClick, isLoading = false }: Props) {
    const { isExpanded, setIsExpanded } = useSidebar();

    return (
        <div className="px-6 py-4 flex justify-center shrink-0">
            <button
                onClick={() => {
                    if (!isExpanded) {
                        setIsExpanded(true);
                        return;
                    }
                    onClick();
                }}
                disabled={isLoading}
                className={`flex items-center justify-center overflow-hidden shrink-0 gap-2 cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed
                ${isExpanded
                        ? "bg-success hover:opacity-90 text-foreground font-medium rounded-full shadow-md w-full py-2 px-4"
                        : "text-success hover:bg-foreground rounded-lg w-11 h-11 p-0"
                    }`}
            >
                {isLoading ? (
                    <Loader2 size={20} className="shrink-0 animate-spin" />
                ) : (
                    <FileSpreadsheet size={20} className="shrink-0" />
                )}
                {isExpanded && (
                    <span className="whitespace-nowrap">
                        {isLoading ? "Exportando..." : text}
                    </span>
                )}
            </button>
        </div>
    );
}
import { FileSpreadsheet, Loader2 } from "lucide-react";

interface Props {
    onClick: () => void;
    title?: string;
    isLoading?: boolean;
}

export function ExcelButton({ onClick, title = "Exportar a Excel", isLoading = false }: Props) {
    return (
        <button
            onClick={onClick}
            title={isLoading ? "Exportando..." : title}
            disabled={isLoading}
            className="fixed bottom-4 right-8 bg-success hover:opacity-90 text-foreground p-3 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 z-50 flex items-center justify-center cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
            {isLoading ? (
                <Loader2 size={25} strokeWidth={2} className="animate-spin" />
            ) : (
                <FileSpreadsheet size={25} strokeWidth={2} />
            )}
        </button>
    );
}
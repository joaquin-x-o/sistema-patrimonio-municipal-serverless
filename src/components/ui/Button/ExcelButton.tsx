import { FileSpreadsheet } from "lucide-react";

interface Props {
    onClick: () => void;
    title?: string;
}

export function ExcelButton({ onClick, title = "Exportar a Excel" }: Props) {
    return (
        <button onClick={onClick} title={title}
            className="fixed bottom-4 right-8 bg-success hover:opacity-90 text-foreground p-3 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 z-50 flex items-center justify-center cursor-pointer border-none"
        >
            <FileSpreadsheet size={25} strokeWidth={2} />
        </button>
    );
}
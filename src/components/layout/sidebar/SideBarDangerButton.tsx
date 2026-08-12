import { Trash2 } from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import { Link } from "react-router-dom";

interface Props {
    text: string;
    to: string;
}

export function SidebarDangerButton({ text, to }: Props) {
    const { isExpanded, setIsExpanded } = useSidebar();

    return (
        <div className="px-6 py-4 flex justify-center shrink-0">
            <Link
                to={to}
                onClick={(e) => {
                    if (!isExpanded) {
                        e.preventDefault();
                        setIsExpanded(true);
                    }
                }}

                className={`flex items-center justify-center overflow-hidden shrink-0 gap-2
                ${isExpanded
                        ? "bg-danger hover:bg-red-600 text-foreground font-medium rounded-full shadow-md w-full py-2 px-4"
                        : "text-danger hover:bg-foreground rounded-lg w-11 h-11 p-0"
                    }`}
            >
                {isExpanded ? (
                    <>
                        <Trash2 size={20} className="shrink-0" />
                        <span className="whitespace-nowrap">{text}</span>
                    </>
                ) : (
                    <Trash2 size={20} className="shrink-0" />
                )}
            </Link>
        </div>
    );
}
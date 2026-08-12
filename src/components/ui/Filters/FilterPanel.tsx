import { ChevronDown, ChevronUp, ListFilter } from "lucide-react";

interface Props {
    title?: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
};

export function FilterPanel({ title = "Filtros", isOpen, onToggle, children }: Props) {
    return (
        <div className="mb-6">
            <div className="flex justify-end w-full">
                <button
                    onClick={onToggle}
                    className="flex items-center gap-2 text-xs font-bold text-foreground-muted cursor-pointer"
                >
                    <ListFilter size={16} />
                    {title}
                    {isOpen ? <ChevronUp size={16} className="mt-px" /> : <ChevronDown size={16} />}
                </button>
            </div>


            {isOpen && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-neutral rounded-lg">
                    {children}
                </div>
            )}
        </div>
    );
}
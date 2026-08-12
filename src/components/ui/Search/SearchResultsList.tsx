import type { ReactNode } from "react";

type Props<T> = {
    items: T[];
    getKey: (item: T) => string | number;
    onSelect: (item: T) => void;
    children: (item: T) => ReactNode;
    emptyMessage?: string;
    className?: string;
};

export function SearchResultsList<T>({
    items,
    getKey,
    onSelect,
    children,
    emptyMessage = "No se encontraron resultados",
    className = "",
}: Props<T>) {
    return (
        <div className={`overflow-hidden flex flex-col max-h-64 overflow-y-auto ${className}`}>
            {items.length ? (
                <div className="flex flex-col py-1">
                    {items.map((item) => (
                        <div
                            key={getKey(item)}
                            onClick={() => onSelect(item)}
                            className="px-4 py-3 border-b border-slate-100 cursor-pointer hover:bg-surface-muted transition-colors last:border-0"
                        >
                            {children(item)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-6 text-center text-sm text-primary">
                    {emptyMessage}
                </div>
            )}
        </div>
    );
}
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option<T extends string> = {
    label: string;
    value: T | "";
};

type Props<T extends string> = {
    label: string;
    value: T | "";
    options: Option<T>[];
    onChange: (value: T | "") => void;
};

// componente de filtro desplegable para seleccionar una opción entre varias
export function SelectFilter<T extends string>({ label, value, options, onChange }: Props<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // opcion seleccionada o texto por defecto si no hay seleccionada ninguna
    const selectedLabel = options.find(opt => opt.value === value)?.label || "Seleccionar...";

    // si el usuario hace click fuera de la lista, se cierra el menú
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-1 relative" ref={dropdownRef}>

            <label className="text-xs font-bold uppercase text-foreground-muted">
                {label}
            </label>

            {/* botón para desplegar la lista de opciones*/}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 border border-neutral rounded-md text-sm text-foreground-muted bg-foreground flex justify-between items-center w-full focus:outline-none focus:ring-1 focus:ring-primary"
            >
                <span className="truncate">{selectedLabel}</span>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* lista de opciones */}
            {isOpen && (
                <ul className="absolute z-50 top-[105%] left-0 w-full bg-foreground border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value as T);
                                setIsOpen(false);
                            }}
                            className={`p-2 text-sm cursor-pointer hover:bg-surface-muted transition-colors border-b border-slate-50 last:border-0 text-foreground-muted
                                      ${value === opt.value ? "bg-primary/5 font-semibold text-primary" : "text-slate-700"}`}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}
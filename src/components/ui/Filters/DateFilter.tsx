import { useEffect, useRef, useState } from "react";
import type { DateFilterOptions } from "../../../types/dataFilterOptions.type";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
    label: string;
    mode: DateFilterOptions;
    value: string;
    onModeChange: (mode: DateFilterOptions) => void;
    onValueChange: (value: string) => void;
};

const dateModeOptions: { value: DateFilterOptions; label: string }[] = [
    { value: "EXACT", label: "En:" },
    { value: "BEFORE", label: "Antes de:" },
    { value: "AFTER", label: "Después de:" },
];

export function DateFilter({
    label,
    mode,
    value,
    onModeChange,
    onValueChange,
}: Props) {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    const selectedLabel = dateModeOptions.find(opt => opt.value === mode)?.label || "En:";

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
        <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-foreground-muted">
                {label}
            </label>

            <div className="flex w-full">
                <div className="relative flex" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-2 py-2 border border-neutral border-r-0 rounded-l-md text-sm bg-slate-100 text-foreground-muted font-medium flex justify-between items-center gap-2 focus:outline-none focus:ring-1 focus:ring-primary focus:z-10"
                    >
                        <span>{selectedLabel}</span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* La lista desplegable */}
                    {isOpen && (
                        <ul className="absolute z-50 top-[105%] left-0 min-w-35 bg-foreground border border-neutral rounded-md overflow-hidden">
                            {dateModeOptions.map((opt) => (
                                <li
                                    key={opt.value}
                                    onClick={() => {
                                        onModeChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`p-2 text-sm cursor-pointer hover:bg-surface-muted transition-colors border-b border-slate-50 last:border-0 text-foreground-muted
                                              ${mode === opt.value ? "font-semibold" : "text-foreground-muted"}`}
                                >
                                    {opt.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <input
                    type="date"
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    className="p-2 border border-neutral rounded-r-md min-w-0 text-sm flex-1 text-slate-600 outline-none focus:ring-1 focus:ring-primary focus:z-10"
                />
            </div>
        </div>
    );
}
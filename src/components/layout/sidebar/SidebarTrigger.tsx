import { ChevronDown, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import type { ReactNode } from "react";

interface Props {
    name: string;
    icon: ReactNode; // componente de libreria de iconos Lucide
    children: ReactNode;
}

export function SidebarTrigger({ name, icon, children }: Props) {
    const { toggleMenu, openMenu, isExpanded } = useSidebar();
    const open = openMenu === name;

    return (
        <div
            onClick={() => toggleMenu(name)}
            className="w-full flex items-center p-3 rounded hover:bg-primary-hover text-foreground cursor-pointer overflow-hidden"
        >
            {/* Icono*/}
            <div className="shrink-0 flex items-center justify-center">
                {icon}
            </div>

            {/* Titulo del item*/}
            <div
                className={`flex flex-1 items-center justify-between overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0  ml-1"}`}
            >
                <span className="whitespace-nowrap">{children}</span>

                <div className="shrink-0">
                    {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
            </div>
        </div>
    );
}
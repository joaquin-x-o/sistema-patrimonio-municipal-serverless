import type { ReactNode } from "react";
import { useSidebar } from "./SidebarProvider";


interface Props {
    name: string;
    children: ReactNode;
}

export function SidebarContent({ name, children }: Props) {
    const { openMenu, isExpanded } = useSidebar();

    const isOpen = isExpanded && openMenu === name;

    return (
        // muestra u oculta el contenido del menu 
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
                <div className="ml-11 mt-1 flex flex-col gap-2 border-l pl-4 py-2 text-sm text-foreground whitespace-nowrap">
                    {children}
                </div>
            </div>
        </div>
    );
}
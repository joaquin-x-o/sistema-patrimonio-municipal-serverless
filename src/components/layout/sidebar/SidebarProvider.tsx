import { createContext, useContext, useState, type ReactNode } from "react";

// CONTEXTO
interface SidebarContextType {
    openMenu: string | null;
    toggleMenu: (name: string) => void;
    isExpanded: boolean;
    setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

// componente que maneja la logica del sidebar (cuando se abre y que muestra)
export function SidebarProvider({ children }: { children: ReactNode }) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleMenu = (name: string) => {
        if (!isExpanded) {
            setIsExpanded(true);
            setOpenMenu(name);
            return;
        }
        setOpenMenu(prev => prev === name ? null : name);
    };

    return (
        <SidebarContext.Provider value={{ openMenu, toggleMenu, isExpanded, setIsExpanded }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error("useSidebar debe ser usado dentro de un SidebarProvider");
    return context;
};
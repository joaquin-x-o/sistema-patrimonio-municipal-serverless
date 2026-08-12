import { useSidebar } from "./SidebarProvider";
import type { ReactNode } from "react";

interface Props {
    name: string;
    children: (open: boolean) => ReactNode,
}

export function SidebarItem({ name, children }: Props) {
    const { openMenu } = useSidebar();

    let isOpen = false;

    // si el menú abierto en el contexto coincide con el nombre de este ítem, entonces se abre
    if (openMenu === name) {
        isOpen = true;
    }

    return children(isOpen);
}
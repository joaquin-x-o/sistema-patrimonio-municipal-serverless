import { Menu } from "lucide-react";
import { useSidebar } from "./SidebarProvider";


export default function SidebarFooter() {
    const { isExpanded, setIsExpanded } = useSidebar();

    return (
        // linea divisoria
        <div className="border-t border-primary-hover flex shrink-0">
            <div className="w-20 py-4 flex items-center justify-center shrink-0">
                <Menu
                    size={28}
                    className="cursor-pointer text-foreground hover:text-muted transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                />
            </div>

        </div>
    );
}
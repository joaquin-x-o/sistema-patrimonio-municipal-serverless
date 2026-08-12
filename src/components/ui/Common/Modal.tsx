import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"; // control de width
}

export function Modal({ isOpen, onClose, title, children, maxWidth = "2xl" }: Props) {

    // bloqueo del fondo al abrir el modal
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
    };

    return (
        // ocupa toda la pantalla, centrado y con fondo desenfocado
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">

            {/* MODAL */}
            <div className={`bg-surface rounded-xl shadow-2xl w-full flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ${maxWidthClasses[maxWidth]}`}>

                {/* header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-foreground-muted">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-foreground-muted hover:bg-muted  p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Cerrar modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* content */}
                <div className="p-5 overflow-y-auto">
                    {children}
                </div>

            </div>
        </div>
    );
}
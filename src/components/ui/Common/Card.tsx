import type { ReactNode } from "react";
import { FooterLink } from "../Button/FooterLink";

interface Props {
    title?: string;
    total?: number;
    children: ReactNode;

    className?: string;
    centerTitle?: boolean;

    footerLinkTo?: string;
    footerLinkLabel?: string;
    onFooterClick?: () => void;
}

export function Card({ title, total, children, className, centerTitle = false, footerLinkTo, footerLinkLabel = "Ver todos", onFooterClick }: Props) {
    return (
        <div className={`bg-foreground rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-x-hidden ${className}`}>
            {/* titulo */}
            <div className="p-4 border-b border-slate-200">
                <h2 className={`text-foreground-muted font-bold uppercase text-m tracking-wide"> ${centerTitle ? "text-center" : "text-left"}`}>
                    {title}
                    {/* Si total existe, se muestra entre paréntesis */}
                    {total !== undefined && (
                        <span className="ml-2">
                            ({total})
                        </span>
                    )}
                </h2>
            </div>

            {/* contenido */}
            <div className="p-5 flex-1">
                {children}
            </div>

            {/* el footer solo se renderizara si existe realmente una accion al darle click */}
            {(footerLinkTo || onFooterClick) && (
                <div className="p-3 border-t border-slate-50 flex justify-center">
                    <FooterLink
                        label={footerLinkLabel}
                        to={footerLinkTo}
                        onClick={onFooterClick}
                    />
                </div>
            )}
        </div>
    );
}
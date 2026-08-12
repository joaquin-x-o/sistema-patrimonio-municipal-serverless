import type { InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    className?: string;
    id?: string;
    startIcon?: ReactNode
}

export function Input({ label, error, className = "", id, startIcon, ...props }: Props) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={id} className="text-foreground-muted font-medium text-sm">
                    {label}
                </label>
            )}

            <div className="relative w-full">
                {startIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                        {startIcon}
                    </div>
                )}

                <input
                    id={id}
                    className={`border border-neutral bg-surface-muted text-foreground-muted rounded-md py-2 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed ${startIcon ? "pl-10 pr-4" : "px-4"
                        } ${error ? "border-danger focus:border-danger focus:ring-danger" : ""
                        } ${className}`}
                    {...props}
                />
            </div>


            {error && (
                <span className="text-danger text-xs mt-1">{error}</span>
            )}
        </div>
    );
}
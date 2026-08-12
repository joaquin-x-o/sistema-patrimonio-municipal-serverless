import { type TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    className?: string;
    id?: string;
}

export function Textarea({ label, error, className = "", id, ...props }: Props) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={id} className="text-foreground-muted font-medium text-sm">
                    {label}
                </label>
            )}

            <textarea
                id={id}
                className={`border border-neutral bg-surface-muted text-foreground-muted rounded-md py-2 px-4 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none ${error ? "border-danger focus:border-danger focus:ring-danger" : ""
                    } ${className}`}
                {...props}
            />

            {error && (
                <span className="text-danger text-xs mt-1">{error}</span>
            )}
        </div>
    );
}
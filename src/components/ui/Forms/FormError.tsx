import { forwardRef, type ReactNode } from "react";
import { RequestErrorMessage } from "../DataDisplay/RequestErrorMessage";

interface FormErrorProps {
    message: string;
    children?: ReactNode;
}

export const FormError = forwardRef<HTMLDivElement, FormErrorProps>(
    ({ message, children }, ref) => {
        return (
            <div ref={ref} className="flex flex-col items-center gap-4 w-full">
                <RequestErrorMessage message={message} />
                {children}
            </div>
        );
    }
);

FormError.displayName = "FormError";
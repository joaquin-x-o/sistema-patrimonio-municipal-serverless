import type { ReactNode, SyntheticEvent } from "react";
import { Card } from "../Common/Card";
import { Button } from "../Common/Button";
import type { ButtonVariant } from "../Button/buttonStyles";
import { FormError } from "./FormError";
import { FormErrorButton } from "../Button/FormErrorButton";


interface ErrorActionConfig {
    label: string;
    navigateTo: string;
    navigationState: Record<string, any>;
}

interface Props {
    title: string;
    children: ReactNode;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
    onCancel: () => void;

    isLoading?: boolean;

    submitButtonVariant?: ButtonVariant;
    submitText?: React.ReactNode;
    cancelText?: string;

    size?: "sm" | "md";

    error?: string | null;
    errorRef?: React.RefObject<HTMLDivElement | null>;

    errorActionConfig?: ErrorActionConfig;
}

export function Form({
    title,
    children,
    onSubmit,
    onCancel,
    isLoading = false,
    submitButtonVariant = "primary",
    submitText = "Guardar cambios",
    cancelText = "Volver atrás",
    size = "md",
    error,
    errorRef,
    errorActionConfig
}: Props) {

    const maxWidthClass = size === "sm" ? "max-w-lg" : "max-w-3xl";

    return (
        <div className="flex flex-col gap-6 items-center w-full">
            <div className={`w-full ${maxWidthClass} mx-auto`}>
                <Card title={title} centerTitle={true}>
                    <form onSubmit={onSubmit} className="flex flex-col gap-6 p-4">

                        {/* inputs y textos que se pasan como children */}
                        <div className="flex flex-col gap-6">
                            {children}
                        </div>

                        <div className="flex justify-center gap-4 mt-6 pt-4">
                            <Button variant="neutral" type="button" onClick={onCancel} disabled={isLoading}>
                                {cancelText}
                            </Button>
                            <Button variant={submitButtonVariant} type="submit" disabled={isLoading}>
                                {submitText}
                            </Button>
                        </div>

                    </form>
                </Card>
            </div>

            {error && (
                <FormError ref={errorRef} message={error}>
                    {errorActionConfig && (
                        <FormErrorButton
                            label={errorActionConfig.label}
                            navigateTo={errorActionConfig.navigateTo}
                            navigationState={errorActionConfig.navigationState}
                            disabled={isLoading}
                        />
                    )}
                </FormError>
            )}

        </div>
    );
}
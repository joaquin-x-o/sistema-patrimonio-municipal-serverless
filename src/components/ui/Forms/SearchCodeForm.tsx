import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../Input/Input";
import { useEffect } from "react";
import type { ButtonVariant } from "../Button/buttonStyles";
import { HelpButton } from "../Button/HelpButton";
import { InputWithAction } from "../Input/InputWithButton";
import { Form } from "./Form";

// esquema de validacion de codigo de busqueda
const searchCodeSchema = z.object({
    code: z
        .string()
        .min(1, "Debe ingresar un código válido")
        .trim()
});

type SearchCodeForm = z.infer<typeof searchCodeSchema>;

interface Props {
    title: string;
    label: string;
    placeholder?: string;
    submitText?: string;
    submitButtonVariant?: ButtonVariant

    helpText?: string;
    externalValue?: string;

    onHelpClick?: () => void;
    onSubmit: (code: string) => void;
    onCancel: () => void;
}

// formulario generico para la busqueda de un registro por su codigo
export function SearchCodeForm({
    title,
    label,
    placeholder = "...",
    submitButtonVariant = 'primary',
    submitText = "Buscar",
    helpText = "Ver opciones",
    externalValue,
    onHelpClick,
    onSubmit,
    onCancel
}: Props) {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<SearchCodeForm>({
        resolver: zodResolver(searchCodeSchema)
    });

    useEffect(() => {
        if (externalValue !== undefined) setValue("code", externalValue);
    }, [externalValue]);

    const handleValidSubmit = (data: SearchCodeForm) => {
        onSubmit(data.code);
    };

    return (
        <Form
            title={title}
            submitText={submitText}
            submitButtonVariant={submitButtonVariant}
            cancelText="Cancelar"
            onSubmit={handleSubmit(handleValidSubmit)}
            onCancel={onCancel}
            size="sm"
        >
            <div className="flex flex-col gap-2">
                {/* descripción */}
                <label className="text-foreground-muted font-medium text-sm">
                    {label}
                </label>

                {/* input con acción encapsulado */}
                {onHelpClick ? (
                    <InputWithAction
                        input={
                            <Input
                                placeholder={placeholder}
                                error={errors.code?.message}
                                {...register("code")}
                            />
                        }
                        action={
                            <HelpButton onClick={onHelpClick}>
                                {helpText}
                            </HelpButton>
                        }
                    />
                ) : (
                    <Input
                        placeholder={placeholder}
                        error={errors.code?.message}
                        {...register("code")}
                    />
                )}
            </div>
        </Form>
    );
}
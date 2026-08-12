import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserRequest } from "../../../../schemas/user.schemas";;
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { useCreateUser } from "../../../../hooks/query/users/actions/useCreateUser";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { PasswordToggleButton } from "../../../ui/Button/PasswordToggleButton";
import { InputWithAction } from "../../../ui/Input/InputWithButton";
import { SelectInput } from "../../../ui/Input/SelectInput";
import { useFormOptions } from "../../../../hooks/forms/useFormSelectOptions";
import { useAuth } from "../../../../hooks/auth/useAuth";

interface Props {
    onSuccess: (code: string) => void;
    onBack: () => void;
}

export function CreateUserForm({ onSuccess, onBack }: Props) {
    const { user } = useAuth();
    const { createUser } = useCreateUser();

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const { roleOptions } = useFormOptions()

    const { register, handleSubmit, control, reset, formState: { errors, isDirty }, setError } = useForm<CreateUserRequest>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            role: undefined
        }
    });

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: CreateUserRequest) => {
        await submit({
            logLabel: "crear usuario",
            action: () => createUser(user!.id, data),
            onSuccess: (result) => onSuccess(result.username),
            setFormFieldError: (field, error) => setError(field as any, error),
            fieldErrors: [
                {
                    message: "El nombre de usuario ya está en uso",
                    field: "username"
                }
            ]
        });
    };

    return (
        <Form
            title="Crear nuevo usuario"
            submitText={getSubmitText(loading, "Crear")}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onBack}
            isLoading={loading}
            error={error}
            errorRef={errorRef}
        >
            <FormField label="Nombre">
                <Input {...register("name")} error={errors.name?.message} disabled={loading} />
            </FormField>

            <FormField label="Apellido">
                <Input {...register("surname")} error={errors.surname?.message} disabled={loading} />
            </FormField>

            <FormField label="Nombre de usuario">
                <Input {...register("username")} error={errors.username?.message} disabled={loading} />
            </FormField>

            <FormField label="Contraseña">
                <InputWithAction
                    input={
                        <Input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            error={errors.password?.message}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    }
                    action={
                        <PasswordToggleButton
                            isVisible={showPassword}
                            disabled={loading}
                            onToggle={() => setShowPassword(!showPassword)}
                        />
                    }
                />
            </FormField>

            <FormField label="Rol">
                <SelectInput
                    name="role"
                    control={control}
                    options={roleOptions}
                    error={errors.role?.message}
                />
            </FormField>

            <FormResetButton
                isDirty={isDirty}
                disabled={loading}
                onReset={() => {
                    reset();
                    setGlobalError(null);
                }}
            />

        </Form>


    );
}
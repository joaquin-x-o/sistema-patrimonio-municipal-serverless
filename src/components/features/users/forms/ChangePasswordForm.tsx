import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserResponse } from "../../../../interfaces/responses/userResponse";
import { updatePasswordSchema, type ChangePasswordRequest } from "../../../../schemas/user.schemas";
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { useChangePassword } from "../../../../hooks/auth/useChangePassword";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { PasswordToggleButton } from "../../../ui/Button/PasswordToggleButton";
import { InputWithAction } from "../../../ui/Input/InputWithButton";

interface Props {
    userData: UserResponse;
    onSuccess: () => void;
    onBack: () => void;
}

export function ChangePasswordForm({ userData, onSuccess, onBack }: Props) {
    const { updatePassword } = useChangePassword();

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const { register, handleSubmit, reset, formState: { errors, isDirty }, setError } = useForm<ChangePasswordRequest>({
        resolver: zodResolver(updatePasswordSchema),
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (data: ChangePasswordRequest) => {

        await submit({
            logLabel: "actualizar contraseña",
            action: () => updatePassword(userData.username, data),
            onSuccess: () => {
                reset();
                onSuccess();
            },
            setFormFieldError: (field, error) => setError(field as any, error),
        });
    };

    return (
        <Form
            title="Cambiar contraseña"
            onSubmit={handleSubmit(onSubmit)}
            submitText={getSubmitText(loading, "Cambiar")}
            isLoading={loading}
            onCancel={onBack}
            error={error}
            errorRef={errorRef}
        >
            <FormField label="Contraseña actual">
                <InputWithAction
                    input={
                        <Input
                            {...register("oldPassword")}
                            type={showOldPassword ? "text" : "password"}
                            error={errors.oldPassword?.message}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    }
                    action={
                        <PasswordToggleButton
                            isVisible={showOldPassword}
                            disabled={loading}
                            onToggle={() => setShowOldPassword(!showOldPassword)}
                        />
                    }
                />
            </FormField>

            <FormField label="Contraseña nueva">
                <InputWithAction
                    input={
                        <Input
                            {...register("newPassword")}
                            type={showNewPassword ? "text" : "password"}
                            error={errors.newPassword?.message}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    }
                    action={
                        <PasswordToggleButton
                            isVisible={showNewPassword}
                            disabled={loading}
                            onToggle={() => setShowNewPassword(!showNewPassword)}
                        />
                    }
                />
            </FormField>

            <FormField label="Confirmar contraseña">
                <InputWithAction
                    input={
                        <Input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            error={errors.confirmPassword?.message}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    }
                    action={
                        <PasswordToggleButton
                            isVisible={showConfirmPassword}
                            disabled={loading}
                            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    }
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
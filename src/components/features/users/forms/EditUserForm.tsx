import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import type { UserResponse } from "../../../../interfaces/responses/userResponse";
import { updateUserSchema, type UpdateUserRequest } from "../../../../schemas/user.schemas";
import { useUpdateUser } from "../../../../hooks/query/users/actions/useUpdateUser";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { SelectInput } from "../../../ui/Input/SelectInput";
import { useFormOptions } from "../../../../hooks/forms/useFormSelectOptions";
import { useAuth } from "../../../../hooks/auth/useAuth";

interface Props {
    userData: UserResponse;
    onSuccess: (newUsername: string) => void;
    onBack: () => void;
}

export function EditUserForm({ userData, onSuccess, onBack }: Props) {

    const { user } = useAuth()
    const { updateUser } = useUpdateUser();
    const { submit, loading, error: apiError, setError: setGlobalError } = useFormSubmitHandler();

    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!apiError);

    const { roleOptions } = useFormOptions()

    const { register, handleSubmit, control, reset, formState: { errors, isDirty }, setError } = useForm<UpdateUserRequest>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: userData.name,
            surname: userData.surname,
            username: userData.username,
            role: userData.role
        }
    });

    const onSubmit = async (data: UpdateUserRequest) => {
        await submit({
            logLabel: "editar usuario",
            action: () => updateUser(user!.id, userData.username, data),
            onSuccess: (updatedUser) => onSuccess(updatedUser.username),
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
            title="Editar usuario"
            submitText={getSubmitText(loading, "Editar")}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onBack}
            error={apiError}
            errorRef={errorRef}
        >

            <FormField label="Nombre">
                <Input {...register("name")} error={errors.name?.message} />
            </FormField>

            <FormField label="Apellido">
                <Input {...register("surname")} error={errors.surname?.message} />
            </FormField>

            <FormField label="Nombre de usuario">
                <Input {...register("username")} error={errors.username?.message} readOnly />
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
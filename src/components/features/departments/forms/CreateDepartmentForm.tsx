import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { CreateDepartmentSchema, type CreateDepartmentRequest } from "../../../../schemas/department.schemas";
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { useCreateDepartment } from "../../../../hooks/query/departments/actions/useCreateDepartment";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { useAuth } from "../../../../hooks/auth/useAuth";

interface Props {
    onSuccess: (code: string) => void;
    onBack: () => void;
}

export function CreateDepartmentForm({ onSuccess, onBack }: Props) {
    const { user } = useAuth();
    const { createDepartment } = useCreateDepartment();

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const { register, handleSubmit, reset, formState: { errors, isDirty }, setError } = useForm<CreateDepartmentRequest>({
        resolver: zodResolver(CreateDepartmentSchema)
    });

    const onSubmit = async (data: CreateDepartmentRequest) => {
        await submit({
            logLabel: "crear área",
            action: () => createDepartment(user!.id, data),
            onSuccess: () => onSuccess(data.departmentCode),
            setFormFieldError: (field, error) => setError(field as any, error),
            fieldErrors: [
                {
                    message: "El código indicado ya está en uso.",
                    field: "departmentCode"
                }
            ]
        });
    };

    return (
        <Form
            title="Crear nueva área"
            submitText={getSubmitText(loading, "Crear")}
            isLoading={loading}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onBack}

            error={error}
            errorRef={errorRef}
        >
            <FormField label="Nombre">
                <Input
                    {...register("name")}
                    error={errors.name?.message}
                    disabled={loading}
                />
            </FormField>

            <FormField label="Código">
                <Input
                    {...register("departmentCode")}
                    className="uppercase"
                    error={errors.departmentCode?.message}
                    disabled={loading}
                />
            </FormField>

            <FormField label="Nombre responsable">
                <Input
                    {...register("responsibleName")}
                    error={errors.responsibleName?.message}
                    disabled={loading}
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
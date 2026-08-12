import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { type DepartmentResponse, type UpdateDepartmentRequest, UpdateDepartmentSchema } from "../../../../schemas/department.schemas";
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { useUpdateDepartment } from "../../../../hooks/query/departments/actions/useUpdateDepartment";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { useAuth } from "../../../../hooks/auth/useAuth";

interface Props {
    departmentData: DepartmentResponse;
    onSuccess: (newProductCode: string) => void;
    onBack: () => void;
}

export function EditDepartmentForm({ departmentData, onSuccess, onBack }: Props) {
    const { user } = useAuth();
    const { updateDepartment } = useUpdateDepartment();

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const { register, handleSubmit, reset, formState: { errors, isDirty }, setError } = useForm<UpdateDepartmentRequest>({
        resolver: zodResolver(UpdateDepartmentSchema),
        defaultValues: {
            name: departmentData.name,
            departmentCode: departmentData.departmentCode,
            responsibleName: departmentData.responsibleName
        }
    });

    const onSubmit = async (data: UpdateDepartmentRequest) => {
        const dataRequest = { ...data, departmentCode: data.departmentCode ? data.departmentCode.toUpperCase() : undefined };

        await submit({
            logLabel: "actualizar área",
            action: () => updateDepartment(user!.id, departmentData.departmentCode, dataRequest),
            onSuccess: (updatedDepartment) => onSuccess(updatedDepartment.departmentCode),
            setFormFieldError: (field, error) => setError(field as any, error),
            fieldErrors: [
                {
                    message: "El nuevo código indicado ya está en uso",
                    field: "departmentCode"
                }
            ]
        });
    };

    return (
        <Form
            title="Editar área"
            submitText={getSubmitText(loading, "Editar")}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onBack}
            isLoading={loading}

            error={error}
            errorRef={errorRef}
        >
            <FormField label="Nombre">
                <Input {...register("name")} error={errors.name?.message} disabled={loading} />
            </FormField>

            <FormField label="Código">
                <Input {...register("departmentCode")} className="uppercase" error={errors.departmentCode?.message} disabled={loading} />
            </FormField>

            <FormField label="Nombre responsable">
                <Input {...register("responsibleName")} error={errors.responsibleName?.message} disabled={loading} />
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
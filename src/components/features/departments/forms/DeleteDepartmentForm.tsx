import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { type DepartmentResponse } from "../../../../schemas/department.schemas";
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";

import { useDeleteDepartment } from "../../../../hooks/query/departments/actions/useDeleteDepartment";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { useAuth } from "../../../../hooks/auth/useAuth";

interface Props {
    departmentData: DepartmentResponse;
    onSuccess: () => void;
    onBack: () => void;
}

export function DeleteDepartmentForm({ departmentData, onSuccess, onBack }: Props) {
    const { user } = useAuth();
    const { deleteDepartment } = useDeleteDepartment();

    const { submit, loading, error } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const handleConfirm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        await submit({
            logLabel: "eliminar área",
            action: () => deleteDepartment(user!.id, departmentData.departmentCode),
            onSuccess: () => onSuccess()
        });
    };


    return (
        <Form
            title="Eliminar área"
            submitButtonVariant="danger"
            submitText={getSubmitText(loading, "Eliminar")}
            isLoading={loading}
            onSubmit={handleConfirm}
            onCancel={onBack}

            error={error}
            errorRef={errorRef}
            errorActionConfig={{
                label: "Deshabilitar",
                navigateTo: "/area/deshabilitar",
                navigationState: { departmentCode: departmentData.departmentCode }
            }}
        >

            <FormField label="Nombre">
                <Input value={departmentData.name} readOnly disabled={loading} />
            </FormField>

            <FormField label="Código">
                <Input value={departmentData.departmentCode} readOnly className="uppercase" disabled={loading} />
            </FormField>

            <FormField label="Nombre responsable">
                <Input value={departmentData.responsibleName} readOnly disabled={loading} />
            </FormField>
        </Form>
    );
}
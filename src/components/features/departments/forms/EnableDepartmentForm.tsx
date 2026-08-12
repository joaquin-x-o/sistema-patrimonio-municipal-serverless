import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { type DepartmentResponse } from "../../../../schemas/department.schemas";
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { useDepartmentStatus } from "../../../../hooks/query/departments/actions/useDepartmentStatus";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";


interface Props {
    departmentData: DepartmentResponse;
    onSuccess: () => void;
    onBack: () => void;
}

export function EnableDepartmentForm({ departmentData, onSuccess, onBack }: Props) {
    const { changeStatus } = useDepartmentStatus();

    const { submit, loading, error } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const handleConfirm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        await submit({
            logLabel: "habilitar área",
            action: async () => {
                const hasBeenEnabled = await changeStatus("enable", departmentData.departmentCode);
                if (!hasBeenEnabled) {
                    throw new Error("No se pudo habilitar el área. Intente nuevamente.");
                }
                return hasBeenEnabled;
            },
            onSuccess: () => onSuccess()
        });
    };

    return (
        <Form
            title="Habilitar área"
            submitText={getSubmitText(loading, "Habilitar")}
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
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import type { UserResponse } from "../../../../interfaces/responses/userResponse";
import { userRoleTranslation } from "../../../../utils/dictionaries/userDictionary";
import type { UserRole } from "../../../../types/user.type";
import { useUserStatus } from "../../../../hooks/query/users/actions/useChangeUserStatus";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";


interface Props {
    userData: UserResponse;
    onSuccess: () => void;
    onBack: () => void;
}

export function DisableUserForm({ userData, onSuccess, onBack }: Props) {
    const { changeStatus } = useUserStatus();

    const { submit, loading, error } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const handleConfirm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        await submit({
            logLabel: "deshabilitar usuario",
            action: async () => {
                const hasBeenDisabled = await changeStatus("disable", userData.username);
                if (!hasBeenDisabled) {
                    throw new Error("No se pudo deshabilitar al usuario. Intente nuevamente.");
                }
                return hasBeenDisabled;
            },
            onSuccess: () => onSuccess()
        });
    };

    return (
        <Form
            title="Deshabilitar usuario"
            submitText={getSubmitText(loading, "Deshabilitar")}
            isLoading={loading}
            onSubmit={handleConfirm}
            onCancel={onBack}

            error={error}
            errorRef={errorRef}
            errorActionConfig={{
                label: "Habilitar",
                navigateTo: "/usuario/habilitar",
                navigationState: { username: userData.username }
            }}
        >
            <FormField label="Nombre">
                <Input value={userData.name} readOnly disabled={loading} />
            </FormField>

            <FormField label="Apellido">
                <Input value={userData.surname} readOnly disabled={loading} />
            </FormField>

            <FormField label="Usuario">
                <Input value={userData.username} readOnly disabled={loading} />
            </FormField>

            <FormField label="Rol">
                <Input
                    value={userRoleTranslation[userData.role as UserRole]}
                    readOnly
                    disabled={loading}
                />
            </FormField>
        </Form>
    );
}
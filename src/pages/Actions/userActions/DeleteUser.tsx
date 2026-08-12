import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { useNavigate } from "react-router-dom";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { type UserResponse } from "../../../interfaces/responses/userResponse";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { UserSearchModal } from "../../../components/features/users/UserSearchModal";
import { getUserByUsername } from "../../../services/users/user.service";
import { DeleteUserForm } from "../../../components/features/users/forms/DeleteUserForm";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function DeleteUser() {
    const navigate = useNavigate();

    const {
        currentStep,
        entityData: userData,
        apiError,
        handleSearchSubmit,
        handleCancelSearch,
        handleBackFromForm,
        handleSuccess
    } = useWizardFlow<UserResponse>({
        stateKey: "username",
        fetchEntity: getUserByUsername
    });

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [modalUsername, setModalUsername] = useState("");

    return (
        <FormLayout title="Gestión de Usuarios">

            {/* PASO 1: buscar el nombre de usuario */}
            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">

                    <SearchCodeForm
                        title="Eliminar usuario"
                        label="Escriba el nombre de usuario que desee eliminar:"
                        placeholder="Ej: usuario123"
                        submitText="Eliminar"
                        submitButtonVariant="danger"
                        helpText="Ver usuarios"
                        onHelpClick={() => setIsUserModalOpen(true)}
                        externalValue={modalUsername}
                        onSubmit={handleSearchSubmit}
                        onCancel={handleCancelSearch}
                    />

                    {apiError && <RequestErrorMessage message={apiError} />}

                </StepLayout>

            )
            }

            {/* PASO 2: formulario para confirmar el usuario por eliminar */}
            {
                currentStep === "EDIT_FORM" && (
                    <StepLayout variant="form">
                        <DeleteUserForm
                            userData={userData!}
                            onSuccess={handleSuccess}
                            onBack={handleBackFromForm}
                        />
                    </StepLayout>
                )
            }

            {/* PASO 3: respuesta */}
            {
                currentStep === "SUCCESS" && (
                    <StepLayout variant="success">
                        <SuccessfulCard
                            title="Usuario eliminado con éxito"
                            onFinish={() => navigate("/")}
                        />
                    </StepLayout>
                )
            }

            {/* MODAL PARA CONSULTAR USUARIOS DISPONIBLES */}
            <UserSearchModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSelect={(username) => setModalUsername(username)}
            />

        </FormLayout >
    );
}
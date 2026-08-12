import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { useNavigate } from "react-router-dom";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import type { UserResponse } from "../../../interfaces/responses/userResponse";
import { EditUserForm } from "../../../components/features/users/forms/EditUserForm";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { UserSearchModal } from "../../../components/features/users/UserSearchModal";
import { getUserByUsername } from "../../../services/users/user.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function EditUser() {
    const navigate = useNavigate();

    const [updatedUsername, setUpdatedUsername] = useState<string | null>(null);

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

    // si se actualizo el username, se guarda el nuevo valor en este estado 
    const handleFormSuccess = (newUsername: string) => {
        setUpdatedUsername(newUsername);

        if (userData) {
            userData.username = newUsername;
        }

        handleSuccess();
    };

    return (
        <FormLayout title="Gestión de Usuarios">

            {/* PASO 1: buscar nombre de usuario */}
            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">

                    <SearchCodeForm
                        title="Editar usuario"
                        label="Escriba el nombre de usuario que desee editar:"
                        placeholder="Ej: usuario123"
                        submitText="Editar"
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

            {/* PASO 2: formulario para editar usuario */}
            {
                currentStep === "EDIT_FORM" && (
                    <StepLayout variant="form">
                        <EditUserForm
                            userData={userData!}
                            onSuccess={handleFormSuccess}
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
                            title="Usuario actualizado con éxito"
                            onFinish={() => navigate("/")}
                            footerLinkText="Ver usuario"
                            footerLinkTo={`/usuario/${updatedUsername}`}
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
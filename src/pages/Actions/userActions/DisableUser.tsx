import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { useNavigate } from "react-router-dom";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import type { UserResponse } from "../../../interfaces/responses/userResponse";
import { DisableUserForm } from "../../../components/features/users/forms/DisableUserForm";
import { UserSearchModal } from "../../../components/features/users/UserSearchModal";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { getUserByUsername } from "../../../services/users/user.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function DisableUser() {
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

            {/* PASO 1: buscar nombre de usuario */}
            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">

                    <SearchCodeForm
                        title="Deshabilitar usuario"
                        label="Escriba el nombre de usuario que desee deshabilitar:"
                        placeholder="Ej: username123"
                        submitText="Deshabilitar"
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

            {/* PASO 2: formulario para confirmar el usuario por deshabilitar */}
            {
                currentStep === "EDIT_FORM" && (
                    <StepLayout variant="form">
                        <DisableUserForm
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
                            title="Usuario deshabilitado con éxito"
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
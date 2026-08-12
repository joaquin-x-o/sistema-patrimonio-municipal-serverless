import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { useNavigate } from "react-router-dom";
import { type DepartmentResponse } from "../../../schemas/department.schemas";
import { getDepartmentByCode } from "../../../services/departments/department.service";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { EnableDepartmentForm } from "../../../components/features/departments/forms/EnableDepartmentForm";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { DepartmentSearchModal } from "../../../components/features/departments/DepartmentSearchModal";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function EnableDepartment() {
    const navigate = useNavigate();

    const {
        currentStep,
        entityData: departmentData,
        apiError,
        handleSearchSubmit,
        handleCancelSearch,
        handleBackFromForm,
        handleSuccess
    } = useWizardFlow<DepartmentResponse>({
        stateKey: "departmentCode",
        fetchEntity: getDepartmentByCode
    });

    const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
    const [modalCode, setModalCode] = useState("");

    return (
        <FormLayout title="Gestión de Áreas">

            {/* PASO 1: buscar codigo del area */}
            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">

                    <SearchCodeForm
                        title="Habilitar área"
                        label="Escriba el código del área que desee habilitar:"
                        placeholder="Ej: D1"
                        submitText="Habilitar"
                        helpText="Ver áreas"
                        onHelpClick={() => setIsDepartmentModalOpen(true)}
                        externalValue={modalCode}
                        onSubmit={handleSearchSubmit}
                        onCancel={handleCancelSearch}
                    />

                    {apiError && <RequestErrorMessage message={apiError} />}

                </StepLayout>

            )}

            {/* PASO 2: formulario para confirmar el area por habilitar */}
            {currentStep === "EDIT_FORM" && (
                <StepLayout variant="form">
                    <EnableDepartmentForm
                        departmentData={departmentData!}
                        onSuccess={handleSuccess}
                        onBack={handleBackFromForm}
                    />
                </StepLayout>
            )}

            {/* PASO 3: respuesta */}
            {currentStep === "SUCCESS" && (
                <StepLayout variant="success">
                    <SuccessfulCard
                        title="Área habilitada con éxito"
                        onFinish={() => navigate("/")}
                    />
                </StepLayout>
            )}

            {/* MODAL PARA CONSULTAR AREAS DISPONIBLES */}
            <DepartmentSearchModal
                isOpen={isDepartmentModalOpen}
                onClose={() => setIsDepartmentModalOpen(false)}
                onSelect={(code) => setModalCode(code)}
            />

        </FormLayout>
    );
}
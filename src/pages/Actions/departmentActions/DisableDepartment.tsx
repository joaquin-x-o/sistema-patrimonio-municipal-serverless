import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { useNavigate } from "react-router-dom";
import { type DepartmentResponse } from "../../../schemas/department.schemas";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { DisableDepartmentForm } from "../../../components/features/departments/forms/DisableDepartmentForm";
import { useState } from "react";
import { DepartmentSearchModal } from "../../../components/features/departments/DepartmentSearchModal";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { getDepartmentByCode } from "../../../services/departments/department.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function DisableDepartment() {
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

            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">

                    {/* PASO 1: buscar codigo del area */}
                    <SearchCodeForm
                        title="Deshabilitar área"
                        label="Escriba el código del área que desee deshabilitar:"
                        placeholder="Ej: D1"
                        submitText="Deshabilitar"
                        helpText="Ver áreas"
                        onHelpClick={() => setIsDepartmentModalOpen(true)}
                        externalValue={modalCode}
                        onSubmit={handleSearchSubmit}
                        onCancel={handleCancelSearch}
                    />

                    {apiError && <RequestErrorMessage message={apiError} />}

                </StepLayout>
            )}

            {/* PASO 2: formulario para confirmar el area por deshabilitar */}
            {currentStep === "EDIT_FORM" && (
                <StepLayout variant="form">
                    <DisableDepartmentForm
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
                        title="Área deshabilitada con éxito"
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
import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { useNavigate } from "react-router-dom";
import { type DepartmentResponse } from "../../../schemas/department.schemas";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { DeleteDepartmentForm } from "../../../components/features/departments/forms/DeleteDepartmentForm";
import { useState } from "react";
import { DepartmentSearchModal } from "../../../components/features/departments/DepartmentSearchModal";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { getDepartmentByCode } from "../../../services/departments/department.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function DeleteDepartment() {
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
                <StepLayout variant="form">
                    {/* PASO 1: buscar codigo del area */}
                    <SearchCodeForm
                        title="Eliminar área"
                        label="Escriba el código del área que desee eliminar:"
                        placeholder="Ej: D1"
                        submitText="Eliminar"
                        submitButtonVariant="danger"
                        helpText="Ver áreas"
                        onHelpClick={() => setIsDepartmentModalOpen(true)}
                        externalValue={modalCode}
                        onSubmit={handleSearchSubmit}
                        onCancel={handleCancelSearch}
                    />

                    {apiError && <RequestErrorMessage message={apiError} />}

                </StepLayout>
            )}

            {/* PASO 2: formulario para confirmar el area por eliminar */}
            {currentStep === "EDIT_FORM" && (
                <StepLayout variant="form">
                    <DeleteDepartmentForm
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
                        title="Área eliminada con éxito"
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
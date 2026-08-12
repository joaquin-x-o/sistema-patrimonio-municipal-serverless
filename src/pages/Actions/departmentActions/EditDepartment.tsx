import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { useNavigate } from "react-router-dom";
import { EditDepartmentForm } from "../../../components/features/departments/forms/EditDepartmentForm";
import { type DepartmentResponse } from "../../../schemas/department.schemas";
import { getDepartmentByCode } from "../../../services/departments/department.service";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { useState } from "react";
import { DepartmentSearchModal } from "../../../components/features/departments/DepartmentSearchModal";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function EditDepartment() {
    const navigate = useNavigate();

    const [updatedDepartmentCode, setUpdatedDepartmentCode] = useState<string | null>(null);

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

    // si se actualizo el username, se guarda el nuevo valor en este estado 
    const handleFormSuccess = (newDepartementCode: string) => {
        setUpdatedDepartmentCode(newDepartementCode);

        if (departmentData) {
            departmentData.departmentCode = newDepartementCode;
        }

        handleSuccess();
    };

    return (
        <FormLayout title="Gestión de Áreas">

            {/* TITULO */}
            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">

                    {/* PASO 1: buscar codigo del area */}
                    <SearchCodeForm
                        title="Editar área"
                        label="Escriba el código del área que desee editar:"
                        placeholder="Ej: D1"
                        submitText="Editar"
                        helpText="Ver áreas"
                        onHelpClick={() => setIsDepartmentModalOpen(true)}
                        externalValue={modalCode}
                        onSubmit={handleSearchSubmit}
                        onCancel={handleCancelSearch}
                    />

                    {apiError && <RequestErrorMessage message={apiError} />}

                </StepLayout>
            )}

            {/* PASO 2: formulario para editar area */}
            {currentStep === "EDIT_FORM" && (
                <StepLayout variant="form">
                    <EditDepartmentForm
                        departmentData={departmentData!}
                        onSuccess={handleFormSuccess}
                        onBack={handleBackFromForm}
                    />
                </StepLayout>
            )}

            {/* PASO 3: respuesta */}
            {currentStep === "SUCCESS" && (
                <StepLayout variant="success">
                    <SuccessfulCard
                        title="Área actualizada con éxito"
                        onFinish={() => navigate("/")}
                        footerLinkText="Ver área"
                        footerLinkTo={`/area/${updatedDepartmentCode}`}
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
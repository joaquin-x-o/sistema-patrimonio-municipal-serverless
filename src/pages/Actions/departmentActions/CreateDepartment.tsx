import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { CreateDepartmentForm } from "../../../components/features/departments/forms/CreateDepartmentForm";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function CreateDepartment() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<"FORM" | "SUCCESS">("FORM");
    const [createdCode, setCreatedCode] = useState<string | null>(null);

    return (
        <FormLayout title="Gestión de Áreas">

            {/* FORM */}
            {currentStep === "FORM" && (
                <StepLayout variant="form">
                    <CreateDepartmentForm
                        onSuccess={(code) => {
                            setCreatedCode(code);
                            setCurrentStep("SUCCESS");
                        }}
                        onBack={() => navigate(-1)}
                    />
                </StepLayout>
            )}

            {/* SUCCESS */}
            {currentStep === "SUCCESS" && (
                <StepLayout variant="success">
                    <SuccessfulCard
                        title="Área creada con éxito"
                        onFinish={() => navigate("/")}
                        footerLinkText="Ver área"
                        footerLinkTo={`/area/${createdCode?.toUpperCase()}`}
                    />
                </StepLayout>
            )}

        </FormLayout>
    );
}
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { CreateUserForm } from "../../../components/features/users/forms/CreateUserForm";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function CreateUser() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<"FORM" | "SUCCESS">("FORM");
    const [createdUsername, setCreatedUsername] = useState<string | null>(null);

    return (
        <FormLayout title="Gestión de Usuarios">

            {currentStep === "FORM" && (
                <StepLayout variant="form">
                    <CreateUserForm
                        onSuccess={(username) => {
                            setCreatedUsername(username),
                                setCurrentStep("SUCCESS")
                        }}
                        onBack={() => navigate(-1)}
                    />
                </StepLayout>
            )}

            {currentStep === "SUCCESS" && (
                <StepLayout variant="success">
                    <SuccessfulCard
                        title="Usuario creado con éxito"
                        onFinish={() => navigate("/")}
                        footerLinkText="Ver usuario"
                        footerLinkTo={`/usuario/${createdUsername}`}
                    />
                </StepLayout>
            )}

        </FormLayout>
    );
}
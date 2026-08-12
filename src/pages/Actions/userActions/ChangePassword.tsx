import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { ChangePasswordForm } from "../../../components/features/users/forms/ChangePasswordForm";
import { useAuth } from "../../../hooks/auth/useAuth";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function ChangePassword() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState<"FORM" | "SUCCESS">("FORM");



    return (
        <FormLayout title="Mi Perfil">

            {currentStep === "FORM" && (
                <StepLayout variant="search">

                    <ChangePasswordForm
                        userData={user!}
                        onSuccess={() => setCurrentStep("SUCCESS")}
                        onBack={() => navigate(-1)}
                    />
                </StepLayout>
            )
            }

            {
                currentStep === "SUCCESS" && (
                    <StepLayout variant="success">
                        <SuccessfulCard
                            title="Contraseña actualizada con éxito"
                            onFinish={() => navigate("/")}
                            footerLinkText="Volver a mi perfil"
                            footerLinkTo={`/usuario/perfil`}
                        />
                    </StepLayout>
                )
            }

        </FormLayout >
    );
}
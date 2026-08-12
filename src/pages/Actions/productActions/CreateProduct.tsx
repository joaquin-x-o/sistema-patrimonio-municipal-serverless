import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreateProductForm } from "../../../components/features/products/forms/CreateProductForm";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { FormLayout } from "../../../components/layout/FormLayout";
import { StepLayout } from "../../../components/layout/StepLayout";


export default function CreateProduct() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<"FORM" | "SUCCESS">("FORM");
    const [createdCode, setCreatedCode] = useState<string | null>(null);

    return (
        <FormLayout title="Gestión de Productos">
            {currentStep === "FORM" && (
                <StepLayout variant="form">
                    <CreateProductForm
                        onSuccess={(code) => {
                            setCreatedCode(String(code))
                            setCurrentStep("SUCCESS")
                        }}
                        onBack={() => navigate(-1)}
                    />
                </StepLayout>
            )}

            {currentStep === "SUCCESS" && (
                <StepLayout variant="success">
                    <SuccessfulCard
                        title="Producto creado con éxito"
                        onFinish={() => navigate("/")}
                        footerLinkText="Ver producto"
                        footerLinkTo={`/producto/${createdCode}`}
                    />
                </StepLayout>
            )}
        </FormLayout>
    );
}
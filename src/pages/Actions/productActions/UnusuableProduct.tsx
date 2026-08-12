import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { useNavigate } from "react-router-dom";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { useState } from "react";
import type { ProductResponse } from "../../../schemas/product.schemas";
import { ProductSearchModal } from "../../../components/features/products/ProductSearchModal";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { UnusableProductForm } from "../../../components/features/products/forms/UnusableProductForm";
import { getProductByCode } from "../../../services/products/product.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function UnusableProduct() {
    const navigate = useNavigate();

    const {
        currentStep,
        entityData: productData,
        apiError,
        handleSearchSubmit,
        handleCancelSearch,
        handleBackFromForm,
        handleSuccess
    } = useWizardFlow<ProductResponse>({
        stateKey: "productCode",
        fetchEntity: getProductByCode
    });

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalCode, setModalCode] = useState("");

    return (
        <FormLayout title="Gestión de Productos">

            {/* TITULO */}
            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">

                    {/* PASO 1: buscar codigo del producto */}
                    <SearchCodeForm
                        title="Marcar producto en desuso"
                        label="Escriba el código del producto que desee marcar como en desuso:"
                        placeholder="Ej: 3912"
                        submitText="Marcar en desuso"
                        helpText="Ver productos"
                        onHelpClick={() => setIsProductModalOpen(true)}
                        externalValue={modalCode}
                        onSubmit={handleSearchSubmit}
                        onCancel={handleCancelSearch}
                    />

                    {apiError && <RequestErrorMessage message={apiError} />}

                </StepLayout>
            )
            }

            {/* PASO 2: formulario para marcar producto en desuso */}
            {
                currentStep === "EDIT_FORM" && (
                    <StepLayout variant="form">
                        <UnusableProductForm
                            productData={productData!}
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
                            title="Producto marcado como en desuso con éxito"
                            onFinish={() => navigate("/")}
                        />
                    </StepLayout>
                )
            }

            <ProductSearchModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSelect={(code) => setModalCode(code)}
            />

        </FormLayout >
    );
}
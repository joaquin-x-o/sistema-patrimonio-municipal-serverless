import { useNavigate } from "react-router-dom";
import type { ProductResponse } from "../../../schemas/product.schemas";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { ProductSearchModal } from "../../../components/features/products/ProductSearchModal";
import { ReviewProductForm } from "../../../components/features/products/forms/ReviewProductForm";
import { getProductByCode } from "../../../services/products/product.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function ReviewProduct() {
    const navigate = useNavigate();

    const { currentStep, entityData: productData, apiError, handleSearchSubmit, handleCancelSearch, handleBackFromForm, handleSuccess } = useWizardFlow<ProductResponse>({
        stateKey: "productCode",
        fetchEntity: getProductByCode
    });

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalCode, setModalCode] = useState("");

    return (
        <FormLayout title="Gestión de Productos">

            {/* TITULO */}

            {/* PASO 1: buscar codigo del producto */}
            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">

                    <SearchCodeForm
                        title="Revisar producto"
                        label="Escriba el código del producto que desee revisar:"
                        placeholder="Ej: 3912"
                        submitText="Revisar"
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

            {/* PASO 2: formulario para revisar producto */}
            {
                currentStep === "EDIT_FORM" && (
                    <StepLayout variant="form">
                        <ReviewProductForm
                            productData={productData!}
                            onSuccess={handleSuccess}
                            onBack={handleBackFromForm}
                        />
                    </StepLayout>
                )
            }

            {/* PASO 3: respuesta*/}
            {
                currentStep === "SUCCESS" && (
                    <StepLayout variant="success">
                        <SuccessfulCard
                            title="Producto mandado a revisión con éxito"
                            onFinish={() => navigate("/")}
                            footerLinkText="Ver producto"
                            footerLinkTo={`/producto/${productData?.productCode}`}
                        />
                    </StepLayout>
                )
            }

            {/* MODAL PARA CONSULTAR PRODUCTOS */}
            <ProductSearchModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSelect={(code) => setModalCode(code)}
            />

        </FormLayout >
    );
}
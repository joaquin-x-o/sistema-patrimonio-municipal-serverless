import { useNavigate } from "react-router-dom";
import type { ProductResponse } from "../../../schemas/product.schemas";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { ProductSearchModal } from "../../../components/features/products/ProductSearchModal";
import { RepairProductForm } from "../../../components/features/products/forms/RepairProductForm";
import { getProductByCode } from "../../../services/products/product.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function RepairProduct() {
    const navigate = useNavigate();

    const { currentStep, entityData: productData, apiError, handleSearchSubmit, handleCancelSearch, handleBackFromForm, handleSuccess } = useWizardFlow<ProductResponse>({
        stateKey: "productCode",
        fetchEntity: getProductByCode
    });

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalCode, setModalCode] = useState("");

    return (
        <FormLayout title="Gestión de Productos">

            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">
                    <SearchCodeForm
                        title="Reparar producto"
                        label="Escriba el código del producto que desee reparar:"
                        placeholder="Ej: 3912"
                        submitText="Reparar producto"
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

            {
                currentStep === "EDIT_FORM" && (
                    <StepLayout variant="form">
                        <RepairProductForm
                            productData={productData!}
                            onSuccess={handleSuccess}
                            onBack={handleBackFromForm}
                        />
                    </StepLayout>
                )
            }

            {
                currentStep === "SUCCESS" && (
                    <StepLayout variant="success">
                        <SuccessfulCard
                            title="Producto reparado con éxito"
                            onFinish={() => navigate("/")}
                            footerLinkText="Ver producto"
                            footerLinkTo={`/producto/${productData?.productCode}`}
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
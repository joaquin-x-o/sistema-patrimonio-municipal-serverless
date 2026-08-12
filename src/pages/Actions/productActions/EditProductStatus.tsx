import type { ProductResponse } from "../../../schemas/product.schemas";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { ProductSearchModal } from "../../../components/features/products/ProductSearchModal";
import { ProductStatusSelector } from "../../../components/features/products/status/ProductStatusSelector";
import { getProductByCode } from "../../../services/products/product.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function EditProductStatus() {

    const { currentStep, entityData: productData, apiError, handleSearchSubmit, handleCancelSearch, handleBackFromForm } = useWizardFlow<ProductResponse>({
        stateKey: "productCode",
        fetchEntity: getProductByCode
    });

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalProduct, setModalProduct] = useState("");

    return (
        <FormLayout title="Gestión de Productos">

            {/* PASO 1: buscar producto */}
            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">
                    <SearchCodeForm
                        title="Editar estado de producto"
                        label="Escriba el código del producto:"
                        placeholder="Ej: 3912"
                        submitText="Buscar"
                        helpText="Ver productos"
                        onHelpClick={() => setIsProductModalOpen(true)}
                        externalValue={modalProduct}
                        onSubmit={handleSearchSubmit}
                        onCancel={handleCancelSearch}
                    />
                    {apiError && <RequestErrorMessage message={apiError} />}
                </StepLayout>
            )
            }

            {/* PASO 2: mostrar opciones según estado */}
            {
                currentStep === "EDIT_FORM" && (
                    <StepLayout variant="form">
                        <ProductStatusSelector
                            product={productData!}
                            onBack={handleBackFromForm}
                        />
                    </StepLayout>
                )
            }

            <ProductSearchModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSelect={(productCode) => setModalProduct(productCode)}
            />

        </FormLayout >
    );
}
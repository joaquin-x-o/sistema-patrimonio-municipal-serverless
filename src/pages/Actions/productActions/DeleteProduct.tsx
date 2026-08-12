import { useNavigate } from "react-router-dom";
import type { ProductResponse } from "../../../schemas/product.schemas";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { DeleteProductForm } from "../../../components/features/products/forms/DeleteProductForm";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { ProductSearchModal } from "../../../components/features/products/ProductSearchModal";
import { getProductByCode } from "../../../services/products/product.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function DeleteProduct() {
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
    const [modalProduct, setModalProduct] = useState("");

    return (
        <FormLayout title="Gestión de Productos">

            {/* PASO 1: buscar el código del producto */}
            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">
                    <SearchCodeForm
                        title="Eliminar producto"
                        label="Escriba el código del producto que desee eliminar:"
                        placeholder="Ej: 1234"
                        submitText="Eliminar"
                        submitButtonVariant="danger"
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

            {/* PASO 2: formulario para confirmar el producto por editar */}
            {
                currentStep === "EDIT_FORM" && (
                    <StepLayout variant="form">
                        <DeleteProductForm
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
                            title="Producto eliminado con éxito"
                            onFinish={() => navigate("/")}
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
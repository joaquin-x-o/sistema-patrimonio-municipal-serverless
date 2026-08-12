import { useNavigate } from "react-router-dom";
import type { ProductResponse } from "../../../schemas/product.schemas";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { EditProductForm } from "../../../components/features/products/forms/EditProductForm";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { ProductSearchModal } from "../../../components/features/products/ProductSearchModal";
import { getProductByCode } from "../../../services/products/product.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function EditProduct() {
    const navigate = useNavigate();

    const [updatedProductCode, setUpdatedProductCode] = useState<number | null>(null);

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

    // si se actualizo el productCode, se guarda el nuevo valor en este estado 
    const handleFormSuccess = (newProductCode: number) => {
        setUpdatedProductCode(newProductCode);

        if (productData) {
            productData.productCode = newProductCode;
        }

        handleSuccess();
    };

    return (
        <FormLayout title="Gestión de Productos">

            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">
                    <SearchCodeForm
                        title="Editar producto"
                        label="Escriba el código del producto que desee editar:"
                        placeholder="Ej: 3912"
                        submitText="Editar"
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
                        <EditProductForm
                            productData={productData!}
                            onSuccess={handleFormSuccess}
                            onBack={handleBackFromForm}
                        />
                    </StepLayout>
                )
            }

            {
                currentStep === "SUCCESS" && (
                    <StepLayout variant="success">
                        <SuccessfulCard
                            title="Producto actualizado con éxito"
                            onFinish={() => navigate("/")}
                            footerLinkText="Ver producto"
                            footerLinkTo={`/producto/${updatedProductCode}`}
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
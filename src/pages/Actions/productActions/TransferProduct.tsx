import { useNavigate } from "react-router-dom";
import type { ProductResponse } from "../../../schemas/product.schemas";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { ProductSearchModal } from "../../../components/features/products/ProductSearchModal";
import { TransferProductForm } from "../../../components/features/products/forms/TransferProductForm";
import { getProductByCode } from "../../../services/products/product.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function TransferProduct() {
    const navigate = useNavigate();

    const { currentStep, entityData: productData, apiError, handleSearchSubmit, handleCancelSearch, handleBackFromForm, handleSuccess } = useWizardFlow<ProductResponse>({
        stateKey: "productCode",
        fetchEntity: getProductByCode
    });

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalCode, setModalCode] = useState("");

    return (
        <FormLayout title="Gestión de Productos">

            {/* PASO 1: buscar codigo del producto */}
            {currentStep === "SEARCH_CODE" && (
                <StepLayout variant="search">

                    <SearchCodeForm
                        title="Transferir producto"
                        label="Escriba el código del producto que desee transferir:"
                        placeholder="Ej: 3912"
                        submitText="Transferir"
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

            {/* PASO 2: formulario para transferir producto */}
            {
                currentStep === "EDIT_FORM" && (
                    <StepLayout variant="form">
                        <TransferProductForm
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
                            title="Producto transferido con éxito"
                            onFinish={() => navigate("/")}
                            footerLinkText="Ver producto"
                            footerLinkTo={`/producto/${productData?.productCode}`}
                        />
                    </StepLayout>
                )
            }

            {/* MODAL PARA CONSULTAR PRODUCTOS DISPONIBLES */}
            <ProductSearchModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSelect={(code) => setModalCode(code)}
            />

        </FormLayout >
    );
}
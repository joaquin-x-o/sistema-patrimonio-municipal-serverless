import { useNavigate } from "react-router-dom";
import type { ProductResponse } from "../../../schemas/product.schemas";
import { useWizardFlow } from "../../../hooks/common/useWizardFlow";
import { useState } from "react";
import { FormLayout } from "../../../components/layout/FormLayout";
import { SearchCodeForm } from "../../../components/ui/Forms/SearchCodeForm";
import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
import { ProductSearchModal } from "../../../components/features/products/ProductSearchModal";
import { RetireProductForm } from "../../../components/features/products/forms/RetireProductForm";
import { getProductByCode } from "../../../services/products/product.service";
import { StepLayout } from "../../../components/layout/StepLayout";

export default function RetireProduct() {
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
                        title="Dar de baja producto"
                        label="Escriba el código del producto que desee dar de baja:"
                        placeholder="Ej: 3912"
                        submitText="Dar de baja"
                        submitButtonVariant="danger"
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

            {/* PASO 2: formulario para reparar producto */}
            {
                currentStep === "EDIT_FORM" && (
                    <StepLayout variant="form">
                        <RetireProductForm
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
                            title="Producto dado de baja con éxito"
                            onFinish={() => navigate("/")}
                            footerLinkText="Ver reporte de bajas"
                            footerLinkTo="/reportes/bajas/"
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
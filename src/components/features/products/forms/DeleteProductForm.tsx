import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import type { ProductResponse } from "../../../../schemas/product.schemas";
import type { ProductCategory, ProductCondition } from "../../../../types/product.type";
import { categoryTranslations, conditionTranslations } from "../../../../utils/dictionaries/productDictionaries";
import { formatDateAR } from "../../../../utils/date/formattedDate";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { Textarea } from "../../../ui/Input/TextArea";
import { Form } from "../../../ui/Forms/Form";
import { useDeleteProduct } from "../../../../hooks/query/products/actions/useDeleteProduct";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";

interface Props {
    productData: ProductResponse;
    onSuccess: () => void;
    onBack: () => void;
}

export function DeleteProductForm({ productData, onSuccess, onBack }: Props) {
    const { deleteProduct } = useDeleteProduct();

    const { submit, loading, error } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const category = productData?.category ? categoryTranslations[productData.category as ProductCategory] : "Sin categoría";
    const condition = productData?.physicalCondition ? conditionTranslations[productData.physicalCondition as ProductCondition] : "Sin condición";
    const productDate = productData.registrationDate ? formatDateAR(productData.registrationDate) : "Sin fecha de registro";

    const handleConfirm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        await submit({
            logLabel: "eliminar producto",
            action: () => deleteProduct(productData.productCode),
            onSuccess: () => onSuccess()
        });
    };

    return (
        <Form
            title="Eliminar producto"
            submitButtonVariant="danger"
            submitText={getSubmitText(loading, "Eliminar")}
            isLoading={loading}
            onSubmit={handleConfirm}
            onCancel={onBack}

            error={error}
            errorRef={errorRef}
            errorActionConfig={{
                label: "Modificar estado del producto",
                navigateTo: "/usuario/editar-estado",
                navigationState: { productCode: productData?.productCode }
            }}
        >
            <FormField label="Nombre">
                <Input value={productData.name} readOnly disabled={loading} />
            </FormField>

            <FormField label="Código">
                <Input value={productData.productCode} readOnly disabled={loading} />
            </FormField>

            <FormField label="Ubicación actual">
                <Input value={`${productData.department.name} (${productData.department.departmentCode})`} readOnly disabled={loading} />
            </FormField>

            <FormField label="Categoría">
                <Input value={category} readOnly disabled={loading} />
            </FormField>

            <FormField label="Condición física">
                <Input value={condition} readOnly disabled={loading} />
            </FormField>

            <FormField label="Descripción" align="start">
                <Textarea value={productData.description || "Sin descripción"} readOnly rows={4} disabled={loading} />
            </FormField>

            <FormField label="Observaciones" align="start">
                <Textarea value={productData.observation || "Sin observaciones"} readOnly rows={4} disabled={loading} />
            </FormField>

            <FormField label="Fecha de registro">
                <Input value={productDate} readOnly disabled={loading} />
            </FormField>
        </Form>
    );
}
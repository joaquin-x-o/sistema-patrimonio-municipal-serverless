import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { retireProductSchema, type ProductResponse, type RetireProductRequest } from "../../../../schemas/product.schemas";

import { getTodayDate } from "../../../../utils/date/getTodayDate";

import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { Textarea } from "../../../ui/Input/TextArea";
import { useRetireProduct } from "../../../../hooks/query/products/actions/useRetireProduct";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { useFormOptions } from "../../../../hooks/forms/useFormSelectOptions";
import { SelectInput } from "../../../ui/Input/SelectInput";

interface Props {
    productData: ProductResponse;
    onSuccess: (reason: string) => void;
    onBack: () => void;
}

const todayDate = getTodayDate();

export function RetireProductForm({ productData, onSuccess, onBack }: Props) {
    const { retireProduct } = useRetireProduct();

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const productDetails = `${productData.name} (COD: ${productData.productCode})`;

    const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<RetireProductRequest>({
        resolver: zodResolver(retireProductSchema),
        defaultValues: {
            unusableReason: productData.unusableReason || productData.pendingReviewReason || "",
            retirementDate: todayDate,
        }
    });

    const { retirementTypeOptions } = useFormOptions();

    const onSubmit = async (data: RetireProductRequest) => {
        await submit({
            logLabel: "dar de baja producto",
            action: () => retireProduct(String(productData.productCode), data),
            onSuccess: () => onSuccess(data.unusableReason)
        });
    };

    return (
        <Form
            title="Dar de baja producto"
            submitText={getSubmitText(loading, "Dar", "de baja")}
            isLoading={loading}
            submitButtonVariant="danger"
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onBack}
            error={error}
            errorRef={errorRef}
        >
            <FormField label="Producto">
                <Input value={productDetails} readOnly disabled={loading} />
            </FormField>

            <FormField label="Nro. de resolución">
                <Input
                    {...register("documentReference")}
                    placeholder="..."
                    error={errors.documentReference?.message}
                    disabled={loading}
                />
            </FormField>

            <FormField label="Motivo de retiro" align="start">
                <Textarea
                    {...register("unusableReason")}
                    placeholder="Ej: Producto dañado"
                    error={errors.unusableReason?.message}
                    rows={5}
                    disabled={loading}
                />
            </FormField>

            <FormField label="Tipo de retiro">
                <SelectInput
                    name="retirementType"
                    control={control}
                    options={retirementTypeOptions}
                    error={errors.retirementType?.message}
                />
            </FormField>

            <FormField label="Fecha de baja">
                <Input
                    type="date"
                    {...register("retirementDate")}
                    error={errors.retirementDate?.message}
                    disabled={loading}
                />
            </FormField>

            <FormResetButton
                isDirty={isDirty}
                disabled={loading}
                onReset={() => {
                    reset();
                    setGlobalError(null);
                }}
            />
        </Form>
    );
}
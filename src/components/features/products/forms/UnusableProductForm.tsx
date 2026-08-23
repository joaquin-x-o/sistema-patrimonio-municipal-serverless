import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { markProductUnusableSchema, type MarkProductUnusableRequest, type ProductResponse } from "../../../../schemas/product.schemas";
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { Textarea } from "../../../ui/Input/TextArea";
import { useMarkProductUnusable } from "../../../../hooks/query/products/actions/useMarkAsUnusable";
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

export function UnusableProductForm({ productData, onSuccess, onBack }: Props) {
    const { markUnusable } = useMarkProductUnusable();

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const productDetails = `${productData.name} (COD: ${productData.productCode})`;

    const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<MarkProductUnusableRequest>({
        resolver: zodResolver(markProductUnusableSchema),
        defaultValues: {
            physicalCondition: productData.physicalCondition,
        }
    });

    const { conditionOptions } = useFormOptions()

    const onSubmit = async (data: MarkProductUnusableRequest) => {
        await submit({
            logLabel: "marcar producto en desuso",
            action: () => markUnusable(String(productData.productCode), data),
            onSuccess: () => onSuccess(data.unusableReason!)
        });
    };

    return (
        <Form
            title="Marcar producto en desuso"
            submitText={getSubmitText(loading, "Marcar", "en desuso")}
            isLoading={loading}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onBack}
            error={error}
            errorRef={errorRef}
        >
            <FormField label="Producto">
                <Input value={productDetails} readOnly disabled={loading} />
            </FormField>

            <FormField label="Motivo de desuso" align="start">
                <Textarea
                    {...register("unusableReason")}
                    placeholder="..."
                    error={errors.unusableReason?.message}
                    rows={5}
                    disabled={loading}
                />
            </FormField>

            <FormField label="Condición física">
                <SelectInput
                    name="physicalCondition"
                    control={control}
                    options={conditionOptions}
                    error={errors.physicalCondition?.message}
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
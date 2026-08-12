import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { reviewProductSchema, type ProductResponse, type ReviewProductRequest } from "../../../../schemas/product.schemas";
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { Textarea } from "../../../ui/Input/TextArea";
import { useReviewProduct } from "../../../../hooks/query/products/actions/useReviewProduct";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { useAuth } from "../../../../hooks/auth/useAuth";

interface Props {
    productData: ProductResponse;
    onSuccess: (reason: string) => void;
    onBack: () => void;
}

export function ReviewProductForm({ productData, onSuccess, onBack }: Props) {
    const { user } = useAuth();
    const { reviewProduct } = useReviewProduct();

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const productDetails = `${productData.name} (COD: ${productData.productCode})`;

    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ReviewProductRequest>({
        resolver: zodResolver(reviewProductSchema),
        defaultValues: {}
    });

    const onSubmit = async (data: ReviewProductRequest) => {
        await submit({
            logLabel: "mandar producto a revisión",
            action: () => reviewProduct(user!.id, String(productData.productCode), data),
            onSuccess: () => onSuccess(data.pendingReviewReason!)
        });
    };

    return (
        <Form
            title="Revisar producto"
            submitText={getSubmitText(loading, "Mandar", "a revisión")}
            isLoading={loading}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onBack}
            error={error}
            errorRef={errorRef}
        >
            <FormField label="Producto">
                <Input value={productDetails} readOnly disabled={loading} />
            </FormField>

            <FormField label="Motivo de la revisión" align="start">
                <Textarea
                    {...register("pendingReviewReason")}
                    placeholder="..."
                    error={errors.pendingReviewReason?.message}
                    rows={5}
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
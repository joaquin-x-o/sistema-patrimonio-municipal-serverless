import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { lostProductSchema, type ProductResponse, type LostProductRequest } from "../../../../schemas/product.schemas";

import { getTodayDate } from "../../../../utils/date/getTodayDate";

import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { Textarea } from "../../../ui/Input/TextArea";
import { useLostProduct } from "../../../../hooks/query/products/actions/useMarkProductAsLost";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { useFormOptions } from "../../../../hooks/forms/useFormSelectOptions";
import { SelectInput } from "../../../ui/Input/SelectInput";

interface Props {
    productData: ProductResponse;
    onSuccess: (details: string) => void;
    onBack: () => void;
}

export function LostProductForm({ productData, onSuccess, onBack }: Props) {
    const todayDate = getTodayDate();
    const { markAsLost } = useLostProduct();

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const productDetails = `${productData.name} (COD: ${productData.productCode})`;

    const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<LostProductRequest>({
        resolver: zodResolver(lostProductSchema),
        defaultValues: {
            lossDate: todayDate,
            lossDetails: ""
        }
    });

    const { lossTypeOptions } = useFormOptions()

    const onSubmit = async (data: LostProductRequest) => {
        await submit({
            logLabel: "marcar producto como extraviado",
            action: () => markAsLost(String(productData.productCode), data),
            onSuccess: () => onSuccess(data.lossDetails ?? "")
        });
    };

    return (
        <Form
            title="Marcar producto como extraviado"
            submitText={getSubmitText(loading, "Marcar", "como extraviado")}
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

            <FormField label="Nro. de denuncia">
                <Input
                    {...register("complaintReference")}
                    placeholder="Ej: 105/2026"
                    error={errors.complaintReference?.message}
                    disabled={loading}
                />
            </FormField>

            <FormField label="Tipo de pérdida">
                <SelectInput
                    name="lossType"
                    control={control}
                    options={lossTypeOptions}
                    error={errors.lossType?.message}
                />
            </FormField>

            <FormField label="Detalles del extravío" align="start">
                <Textarea
                    {...register("lossDetails")}
                    placeholder="Ej: El producto fue extraviado durante un traslado."
                    rows={5}
                    error={errors.lossDetails?.message}
                    disabled={loading}
                />
            </FormField>

            <FormField label="Fecha del reporte">
                <Input
                    type="date"
                    {...register("lossDate")}
                    error={errors.lossDate?.message}
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
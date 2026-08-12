import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { repairProductSchema, type ProductResponse, type RepairProductRequest } from "../../../../schemas/product.schemas";
import { getTodayDate } from "../../../../utils/date/getTodayDate";
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { Textarea } from "../../../ui/Input/TextArea";
import { useRepairProduct } from "../../../../hooks/query/products/actions/useRepairProduct";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { useFormOptions } from "../../../../hooks/forms/useFormSelectOptions";
import { SelectInput } from "../../../ui/Input/SelectInput";

interface Props {
    productData: ProductResponse;
    onSuccess: (description: string) => void;
    onBack: () => void;
}

const todayDate = getTodayDate();

export function RepairProductForm({ productData, onSuccess, onBack }: Props) {
    const { repairProduct } = useRepairProduct();

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const productDetails = `${productData.name} (COD: ${productData.productCode})`;
    const unusableReason = productData.unusableReason ?? "Avería desconocida";

    const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<RepairProductRequest>({
        resolver: zodResolver(repairProductSchema),
        defaultValues: {
            physicalCondition: productData.physicalCondition,
            repairDate: todayDate,
        }
    });

    const { conditionOptions } = useFormOptions();

    const onSubmit = async (data: RepairProductRequest) => {
        await submit({
            logLabel: "reparar producto",
            action: () => repairProduct(String(productData.productCode), data),
            onSuccess: () => onSuccess(data.repairDescription!)
        });
    };

    return (
        <Form
            title="Reparar producto"
            submitText={getSubmitText(loading, "Reparar")}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onBack}
            isLoading={loading}
            error={error}
            errorRef={errorRef}
        >
            <FormField label="Producto">
                <Input value={productDetails} readOnly disabled={loading} />
            </FormField>

            <FormField label="Motivo de desuso">
                <Input value={unusableReason} readOnly disabled={loading} />
            </FormField>

            <FormField
                label="Descripción de la reparación"
                align="start"
            >
                <Textarea
                    {...register("repairDescription")}
                    placeholder="..."
                    error={errors.repairDescription?.message}
                    rows={5}
                    disabled={loading}
                />
            </FormField>

            <FormField label="Costo">
                <Input
                    {...register("cost")}
                    placeholder="Ej: 25000"
                    error={errors.cost?.message}
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

            <FormField label="Fecha de reparación">
                <Input
                    type="date"
                    {...register("repairDate")}
                    error={errors.repairDate?.message}
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProductSchema, type ProductResponse, type UpdateProductRequest } from "../../../../schemas/product.schemas";
import { Form } from "../../../ui/Forms/Form";
import { Input } from "../../../ui/Input/Input";
import { Textarea } from "../../../ui/Input/TextArea";
import { FormField } from "../../../ui/Forms/FormField";
import { formatCalendarDateForInput } from "../../../../utils/date/formattedDate";
import { useUpdateProduct } from "../../../../hooks/query/products/actions/useUpdateProduct";
import { generateProductCode } from "../../../../services/products/product.service";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { InputWithAction } from "../../../ui/Input/InputWithButton";
import { HelpButton } from "../../../ui/Button/HelpButton";
import { SelectInput } from "../../../ui/Input/SelectInput";
import { useFormOptions } from "../../../../hooks/forms/useFormSelectOptions";
import { useAuth } from "../../../../hooks/auth/useAuth";

interface Props {
    productData: ProductResponse;
    onSuccess: (newProductCode: number) => void;
    onBack: () => void;
}

export function EditProductForm({ productData, onSuccess, onBack }: Props) {
    const { user } = useAuth()
    const { updateProduct } = useUpdateProduct();

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const { register, handleSubmit, control, setValue, reset, formState: { errors, isDirty }, setError } = useForm<UpdateProductRequest>({
        resolver: zodResolver(updateProductSchema),
        defaultValues: {
            name: productData.name,
            description: productData.description,
            observation: productData.observation ?? "",
            productCode: String(productData.productCode),
            category: productData.category,
            physicalCondition: productData.physicalCondition,
            registrationDate: formatCalendarDateForInput(productData.registrationDate),
        }
    });

    // opciones de categoria y condicion del producto
    const { categoryOptions, conditionOptions } = useFormOptions()

    const onSubmit = async (data: UpdateProductRequest) => {
        await submit({
            logLabel: "editar producto",
            action: async () => {
                const updatedProduct = await updateProduct(user!.id, productData.productCode, data);
                return updatedProduct.productCode;
            },
            onSuccess: (newProductCode) => onSuccess(newProductCode),
            setFormFieldError: (field, error) => setError(field as any, error),
            fieldErrors: [
                {
                    message: "El código de producto ya está en uso.",
                    field: "productCode"
                }
            ]
        });
    };

    const handleGenerateCode = async () => {
        const generatedCode = await generateProductCode();
        setValue("productCode", generatedCode.toString(), {
            shouldDirty: true,
        });
    };

    return (
        <Form
            title="Editar producto"
            submitText={getSubmitText(loading, "Editar")}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onBack}
            isLoading={loading}

            error={error}
            errorRef={errorRef}
        >
            <FormField label="Nombre">
                <Input {...register("name")} error={errors.name?.message} disabled={loading} />
            </FormField>

            <FormField label="Código">
                <InputWithAction
                    input={
                        <Input
                            placeholder="5256"
                            {...register("productCode")}
                            error={errors.productCode?.message}
                            disabled={loading}
                        />
                    }
                    action={
                        <HelpButton onClick={handleGenerateCode} showHelpIcon={false}>
                            Generar código
                        </HelpButton>
                    }
                />
            </FormField>

            <FormField label="Descripción" align="start">
                <Textarea {...register("description")} placeholder="..." error={errors.description?.message} rows={4} disabled={loading} />
            </FormField>

            <FormField label="Observaciones" align="start">
                <Textarea {...register("observation")} placeholder="..." error={errors.observation?.message} rows={4} disabled={loading} />
            </FormField>

            <FormField label="Categoría">
                <SelectInput
                    name="category"
                    control={control}
                    options={categoryOptions}
                    error={errors.category?.message}
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

            <FormField label="Fecha de registro">
                <Input type="date" {...register("registrationDate")} error={errors.registrationDate?.message} disabled={loading} />
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
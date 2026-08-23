import { useState } from "react";
import { createProductSchema, type CreateProductRequest } from "../../../../schemas/product.schemas";
import { getTodayDate } from "../../../../utils/date/getTodayDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../ui/Input/Input";
import { HelpButton } from "../../../ui/Button/HelpButton";
import { Form } from "../../../ui/Forms/Form";
import { useForm } from "react-hook-form";
import { Textarea } from "../../../ui/Input/TextArea";
import { DepartmentSearchModal } from "../../departments/DepartmentSearchModal";
import { FormField } from "../../../ui/Forms/FormField";
import { useAuth } from "../../../../hooks/auth/useAuth";
import { useCreateProduct } from "../../../../hooks/query/products/actions/useCreateProduct";
import { generateProductCode } from "../../../../services/products/product.service";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { InputWithAction } from "../../../ui/Input/InputWithButton";
import { SelectInput } from "../../../ui/Input/SelectInput";
import { useFormOptions } from "../../../../hooks/forms/useFormSelectOptions";

interface Props {
    onSuccess: (code: string | number) => void;
    onBack: () => void;
}

export function CreateProductForm({ onSuccess, onBack }: Props) {

    const { user } = useAuth();
    const { createNewProduct: createProduct } = useCreateProduct();
    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();

    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const today = getTodayDate();

    const { register, handleSubmit, control, setValue, reset, formState: { errors, isDirty }, setError } = useForm<CreateProductRequest>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            category: undefined,
            physicalCondition: undefined,
            registrationDate: today,
        }
    });

    // opciones para los select de categoria y condicion del producto 
    const { categoryOptions, conditionOptions } = useFormOptions()

    const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);

    const onSubmit = async (data: CreateProductRequest) => {
        if (!user) return;

        await submit({
            logLabel: "crear producto",
            action: () => createProduct(data),
            onSuccess: () => onSuccess(data.productCode!),
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
        <>
            <Form
                title="Crear nuevo producto"
                submitText={getSubmitText(loading, "Crear")}
                isLoading={loading}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={onBack}
                error={error}
                errorRef={errorRef}
            >
                <FormField label="Nombre">
                    <Input {...register("name")} placeholder="Monitor Samsung" error={errors.name?.message} />
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

                <FormField label="Ubicación actual">
                    <InputWithAction
                        input={
                            <Input
                                placeholder="A1"
                                {...register("departmentCode")}
                                error={errors.departmentCode?.message}
                                disabled={loading}
                            />
                        }
                        action={
                            <HelpButton onClick={() => setIsDepartmentModalOpen(true)}>
                                Ver áreas
                            </HelpButton>
                        }
                    />
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

                <FormField label="Descripción" align="start">
                    <Textarea {...register("description")} placeholder="..." error={errors.description?.message} rows={4} />
                </FormField>

                <FormField label="Observaciones" align="start">
                    <Textarea {...register("observation")} placeholder="..." error={errors.observation?.message} rows={4} />
                </FormField>

                <FormField label="Número de factura">
                    <Input
                        {...register("invoiceNumber")}
                        placeholder="Ej: 0067-00060676"
                        error={errors.invoiceNumber?.message}
                        disabled={loading}
                    />
                </FormField>

                <FormField label="Valor">
                    <Input
                        {...register("purchasePrice")}
                        placeholder="Ej: 125.000,00"
                        error={errors.purchasePrice?.message}
                        disabled={loading}
                    />
                </FormField>

                <FormField label="Depreciación">
                    <Input
                        {...register("depreciation")}
                        placeholder="Ej: 125.000,00"
                        error={errors.depreciation?.message}
                        disabled={loading}
                    />
                </FormField>

                <FormField label="Fecha de registro">
                    <Input type="date" {...register("registrationDate")} error={errors.registrationDate?.message} />
                </FormField>

                <FormField label="¿Este producto ya existía antes?">
                    <input type="checkbox" {...register("isLegacy")} className="w-4 h-4 mx-5 accent-primary cursor-pointer" />
                </FormField>

                <FormResetButton
                    isDirty={isDirty}
                    disabled={loading}
                    onReset={() => {
                        reset();
                        setGlobalError(null);
                    }}
                />
            </Form >

            <DepartmentSearchModal
                isOpen={isDepartmentModalOpen}
                onClose={() => setIsDepartmentModalOpen(false)}
                onSelect={(code) => {
                    setValue("departmentCode", code, { shouldDirty: true });
                    setIsDepartmentModalOpen(false);
                }}
            />
        </>
    );
}



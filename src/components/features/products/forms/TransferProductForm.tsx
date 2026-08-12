import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { transferProductSchema, type ProductResponse, type TransferProductRequest } from "../../../../schemas/product.schemas";
import { getTodayDate } from "../../../../utils/date/getTodayDate";
import { Form } from "../../../ui/Forms/Form";
import { FormField } from "../../../ui/Forms/FormField";
import { Input } from "../../../ui/Input/Input";
import { Textarea } from "../../../ui/Input/TextArea";
import { HelpButton } from "../../../ui/Button/HelpButton";
import { DepartmentSearchModal } from "../../departments/DepartmentSearchModal";
import { useTransferProduct } from "../../../../hooks/query/products/actions/useTransferProduct";
import { getSubmitText } from "../../../../utils/common/getSubmitText";
import { useFormSubmitHandler } from "../../../../hooks/forms/useFormSubmitHandler";
import { FormResetButton } from "../../../ui/Button/FormResetButton";
import { InputWithAction } from "../../../ui/Input/InputWithButton";

interface Props {
    productData: ProductResponse;
    onSuccess: (code: string | number) => void;
    onBack: () => void;
}

export function TransferProductForm({ productData, onSuccess, onBack }: Props) {
    const { transferProduct } = useTransferProduct();
    const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);

    const { submit, loading, error, setError: setGlobalError } = useFormSubmitHandler();
    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!error);

    const today = getTodayDate();
    const productDetails = `${productData.name} (COD: ${productData.productCode})`;
    const originDepartment = `${productData.department.name} (${productData.department.departmentCode})`;

    const { register, handleSubmit, setValue, reset, formState: { errors, isDirty }, setError } = useForm<TransferProductRequest>({
        resolver: zodResolver(transferProductSchema),
        defaultValues: {
            destinationDepartmentCode: undefined,
            transferDate: today,
        }
    });

    const onSubmit = async (data: TransferProductRequest) => {
        await submit({
            logLabel: "transferir producto",
            action: () => transferProduct(productData.productCode, data),
            onSuccess: () => onSuccess(data.destinationDepartmentCode!),
            setFormFieldError: (field, error) => setError(field as any, error),
            fieldErrors: [
                {
                    message: "El área de destino no puede ser la misma que el área de origen.",
                    field: "destinationDepartmentCode"
                }
            ]
        });
    };

    return (
        <>
            <Form
                title="Transferir producto"
                submitText={getSubmitText(loading, "Confirmar")}
                isLoading={loading}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={onBack}
                error={error}
                errorRef={errorRef}
            >
                <FormField label="Producto">
                    <Input value={productDetails} readOnly disabled={loading} />
                </FormField>

                <FormField label="Ubicación actual">
                    <Input value={originDepartment} readOnly disabled={loading} />
                </FormField>

                <FormField label="Ubicación destino">
                    <InputWithAction
                        input={
                            <Input
                                placeholder="A1"
                                {...register("destinationDepartmentCode")}
                                error={errors.destinationDepartmentCode?.message}
                                disabled={loading}
                            />
                        }
                        action={
                            <HelpButton onClick={() => setIsDepartmentModalOpen(true)}>
                                Generar código
                            </HelpButton>
                        }
                    />
                </FormField>

                <FormField
                    label="Motivo de la transferencia"
                    align="start"
                >
                    <Textarea
                        {...register("reasonForMovement")}
                        placeholder="..."
                        error={errors.reasonForMovement?.message}
                        rows={5}
                        disabled={loading}
                    />
                </FormField>

                <FormField label="Fecha de transferencia">
                    <Input
                        type="date"
                        {...register("transferDate")}
                        error={errors.transferDate?.message}
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

            <DepartmentSearchModal
                isOpen={isDepartmentModalOpen}
                onClose={() => setIsDepartmentModalOpen(false)}
                onSelect={(code) => {
                    setValue("destinationDepartmentCode", code, {
                        shouldDirty: true
                    });
                    setIsDepartmentModalOpen(false);
                }}
            />
        </>
    );
}
import { z } from "zod";
import { ProductCategory, ProductCondition, ProductStatus } from "../types/product.type";
import { RetirementType } from "../types/retirement.type";
import { LossType } from "../types/lost.type";

// REQUESTS

// crear producto
export const createProductSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().min(1, "La descripción es obligatoria"),
    productCode: z.string().regex(/^\d*$/, "El código solo puede contener números"),
    departmentCode: z.string().min(1, "El código del departamento es obligatorio"),

    observation: z.string().optional(),
    isLegacy: z.boolean().optional(),
    category: z.enum(
        Object.values(ProductCategory) as [string, ...string[]], {
        error: () => ({ message: "Seleccione una categoría para el producto." })
    }),
    physicalCondition: z.enum(
        Object.values(ProductCondition) as [string, ...string[]], {
        error: () => ({ message: "Seleccione una condición para el producto." })
    }),
    registrationDate: z.string().optional(),
    status: z.enum(Object.values(ProductStatus) as [string, ...string[]]).optional(),
    pendingReviewReason: z.string().optional(),
});

// editar producto
export const updateProductSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio").optional(),
    description: z.string().min(1, "La descripción es obligatoria").optional(),
    observation: z.string().optional(),
    productCode: z.string().regex(/^\d*$/, "El código solo puede contener números").optional(),
    category: z.enum(Object.values(ProductCategory) as [string, ...string[]]).optional(),
    physicalCondition: z.enum(Object.values(ProductCondition) as [string, ...string[]]).optional(),
    registrationDate: z.string().optional(),
});

// marcar producto como en desuso
export const markProductUnusableSchema = z.object({
    unusableReason: z.string().min(1, "Debe indicar el motivo por el que el producto ya no se puede usar."),
    physicalCondition: z.enum(Object.values(ProductCondition) as [string, ...string[]]).optional(),
});

// reparar producto
export const repairProductSchema = z.object({
    physicalCondition: z.enum(Object.values(ProductCondition) as [string, ...string[]], "Debe indicar la nueva condición física del producto"),
    repairDescription: z.string().min(1, "Debe indicar una descripción de la reparación realizada"),
    cost: z.string().regex(/^\d*$/, "El costo solo puede contener números").optional(),
    repairDate: z.string().optional(),
});

// transferir producto a otro departamento
export const transferProductSchema = z.object({
    destinationDepartmentCode: z.string().min(1, "El código del departamento de destino es obligatorio"),
    reasonForMovement: z.string().min(1, "Debe indicar el motivo de la transferencia"),
    transferDate: z.string().optional(),
});

// marcar producto como perdido
export const lostProductSchema = z.object({
    lossDate: z.string("Debe indicar la fecha en que se reportó la pérdida").optional(),
    complaintReference: z.string()
        .regex(/^\d+\/\d+$/, "El formato debe ser número/año (Ej: 105/2024)")
        .min(1, "El número de denuncia es obligatorio"),
    lossType: z.enum(Object.values(LossType) as [string, ...string[]], "Debe indicar el tipo de pérdida"),
    lossDetails: z.string().optional(),
});

// retirar producto
export const retireProductSchema = z.object({
    unusableReason: z.string().min(1, "Debe indicar el motivo por el que el producto ya no se puede usar"),
    documentReference: z.string()
        .regex(/^\d+\/\d+$/, "El formato debe ser número/año (Ej: 105/2024)")
        .min(1, "El número de resolución es obligatorio"),
    retirementType: z.enum(Object.values(RetirementType) as [string, ...string[]], "Debe indicar el tipo de retiro"),
    retirementDate: z.string("Debe indicar la fecha de retiro").optional(),
});

// revisar producto
export const reviewProductSchema = z.object({
    pendingReviewReason: z.string().min(1, "Debe indicar la razón para la revisión"),
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type UpdateProductRequest = z.infer<typeof updateProductSchema>;
export type MarkProductUnusableRequest = z.infer<typeof markProductUnusableSchema>;
export type RepairProductRequest = z.infer<typeof repairProductSchema>;
export type TransferProductRequest = z.infer<typeof transferProductSchema>;
export type LostProductRequest = z.infer<typeof lostProductSchema>;
export type RetireProductRequest = z.infer<typeof retireProductSchema>;
export type ReviewProductRequest = z.infer<typeof reviewProductSchema>;


// RESPONSES

// ProductResponse
export const ProductResponseSchema = z.object({
    name: z.string(),
    description: z.string(),
    observation: z.string(),

    productCode: z.number(),


    category: z.enum(Object.values(ProductCategory) as [string, ...string[]]),

    physicalCondition: z.enum(Object.values(ProductCondition) as [string, ...string[]]),

    isLegacy: z.boolean(),

    status: z.enum(Object.values(ProductStatus) as [string, ...string[]]),
    statusUpdatedAt: z.string(),

    reviewDaysPending: z.number(),

    registrationDate: z.string().nullable(),

    dateUnusable: z.string().nullable(),
    unusableReason: z.string().nullable(),

    retirementDate: z.string().nullable(),

    needsCheckReview: z.boolean(),
    lastCheckDate: z.string().nullable(),
    pendingReviewReason: z.string().nullable(),

    createdAt: z.string(),
    updatedAt: z.string(),

    department: z.object({ departmentCode: z.string(), name: z.string() }),
    user: z.object({ name: z.string(), surname: z.string() }),
});

// productShortResponse
export const ProductShortResponseSchema = z.object({
    name: z.string(),
    productCode: z.number(),
    category: z.enum(Object.values(ProductCategory) as [string, ...string[]]),
    physicalCondition: z.enum(Object.values(ProductCondition) as [string, ...string[]]),

    registrationDate: z.string().nullable(),

    isLegacy: z.boolean(),

    status: z.enum(Object.values(ProductStatus) as [string, ...string[]]),
    statusUpdatedAt: z.string(),

    reviewDaysPending: z.number(),

    dateUnusable: z.string(),
    unusableReason: z.string().nullable(),

    needsCheckReview: z.boolean(),
    lastCheckDate: z.string().nullable(),

    pendingReviewReason: z.string().nullable(),

    department: z.object({ departmentCode: z.string(), name: z.string() }),
})

// productLightResponse
export const ProductLightResponseSchema = z.object({
    productCode: z.number(),
    name: z.string(),
})

export const ProductListResponseSchema = z.object({
    data: z.array(ProductShortResponseSchema),
    meta: z.object({
        totalItems: z.number(),
        itemCount: z.number(),
        itemsPerPage: z.number(),
        totalPages: z.number(),
        currentPage: z.number(),
    }),
});

export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type ProductShortResponse = z.infer<typeof ProductShortResponseSchema>;
export type ProductLightResponse = z.infer<typeof ProductLightResponseSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;


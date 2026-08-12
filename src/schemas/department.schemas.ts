import { z } from "zod";

// REQUESTS

// codigo del departamento
export const DepartmentCodeSchema = z.object({
    departmentCode: z.string().min(1, "El código es obligatorio"),
});

// datos para crear un nuevo departamento
export const CreateDepartmentSchema = z.object({
    departmentCode: z.string().min(1, "El código es obligatorio"),
    name: z.string().min(1, "El nombre es obligatorio"),
    responsibleName: z.string().min(1, "El responsable es obligatorio"),
});

// datos para editar un departamento existente
export const UpdateDepartmentSchema = z.object({
    name: z.string().min(1, "El nombre debe contener al menos 1 caracter").optional(),
    departmentCode: z.string().min(1, "El código debe contener al menos 1 caracter").optional(),
    responsibleName: z.string().min(1, "El nombre debe contener al menos 1 caracter").optional(),
});

export type DepartmentCodeRequest = z.infer<typeof DepartmentCodeSchema>;
export type CreateDepartmentRequest = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartmentRequest = z.infer<typeof UpdateDepartmentSchema>;

// RESPONSE

// respuesta de un departamento
export const DepartmentResponseSchema = z.object({
    departmentCode: z.string(),
    name: z.string(),
    responsibleName: z.string(),
    isActive: z.boolean(),
    registrationDate: z.string().nullable(),

    productCount: z.number().optional(),
    percentage: z.number().optional(),

    createdAt: z.string(),
    updatedAt: z.string(),
});

// respuesta de la lista de departamentos con paginacion
export const DepartmentListResponseSchema = z.object({
    data: z.array(DepartmentResponseSchema),
    meta: z.object({
        totalItems: z.number(),
        itemCount: z.number(),
        itemsPerPage: z.number(),
        totalPages: z.number(),
        currentPage: z.number(),
    }),
    stats: z.object({
        totalProducts: z.number(),
    }),
});

export type DepartmentResponse = z.infer<typeof DepartmentResponseSchema>;
export type DepartmentListResponse = z.infer<typeof DepartmentListResponseSchema>;
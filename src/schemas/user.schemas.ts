import { z } from "zod";
import { UserRole } from "../types/user.type";


// REQUESTS

// crear usuario
export const createUserSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio."),
    surname: z.string().min(1, "El apellido es obligatorio."),
    username: z.string().min(4, "El nombre de usuario debe tener al menos 4 caracteres."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),

    role: z.enum(Object.values(UserRole) as [string, ...string[]], {
        error: () => ({ message: "Seleccione un rol para el usuario." })
    })
});

// editar usuario
export const updateUserSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio.").optional(),
    surname: z.string().min(1, "El apellido es obligatorio.").optional(),
    username: z.string().min(4, "El nombre de usuario debe tener al menos 4 caracteres.").optional(),
    role: z.enum(Object.values(UserRole) as [string, ...string[]], {
        error: () => ({ message: "Seleccione un rol para el usuario." })
    }),
});

// cambiar contraseña
export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(8, "La contraseña actual debe tener al menos 8 caracteres."),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Debes confirmar la nueva contraseña."),
})
    .refine((data) => data.newPassword !== data.oldPassword, {
        message: "La nueva contraseña no puede ser igual a la anterior.",
        path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Las contraseñas no coinciden.",
        path: ["confirmPassword"],
    });

export type UpdatePasswordRequest = z.infer<typeof updatePasswordSchema>;

// // resetar contraseña
// // NOTA: la funcionalidad de reset password no es funcional aún
// export const resetPasswordSchema = z.object({
//     newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres."),
//     confirmPassword: z.string().min(8, "Debes confirmar la nueva contraseña."),
// }).refine((data) => data.newPassword === data.confirmPassword, {
//     message: "Las contraseñas no coinciden.",
//     path: ["confirmPassword"],
// });

// export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

// iniciar sesion
export const loginSchema = z.object({
    username: z.string().min(1, "El nombre de usuario es obligatorio."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type ChangePasswordRequest = z.infer<typeof updatePasswordSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;


// RESPONSES

// respuesta de un usuario
export const userResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    surname: z.string(),
    username: z.string(),
    isActive: z.boolean(),
    role: z.enum(Object.values(UserRole) as [string, ...string[]]),
});

// respuesta de login
export const loginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: userResponseSchema,
});

// respuesta de la lista de usuarios
export const userListResponseSchema = z.object({
    data: z.array(userResponseSchema),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type UserListResponse = z.infer<typeof userListResponseSchema>;

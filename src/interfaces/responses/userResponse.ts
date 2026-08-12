import type { UserRole } from "../../types/user.type";

export interface UserResponse {
    id: string;
    name: string;
    surname: string;
    username: string;
    isActive: boolean;
    role?: UserRole;
}


export interface UserLightResponse {
    // nombre + apellido
    fullName: string;
    username: string;
}
import type { UserRole } from "../../types/user.type";

// crear usuario
export interface CreateUserDto {
    name: string;
    surname: string;
    username: string;
    password: string;
    role: UserRole;
}

// crear usuario
export interface UpdateUserDto {
    name?: string;
    surname?: string;
    username?: string;
    role?: UserRole;
    updated_at: string
}
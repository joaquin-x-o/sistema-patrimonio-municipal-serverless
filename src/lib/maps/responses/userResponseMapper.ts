import type { UserResponse } from "../../../interfaces/responses/userResponse";
import type { UserRole } from "../../../types/user.type";

export const mapUserRowToResponse = (u: any): UserResponse => ({
    id: u.id,
    name: u.name,
    surname: u.surname,
    username: u.username,
    isActive: u.is_active,
    role: u.role as UserRole
});


import { UserRole } from "../../types/user.type";

export const userRoleTranslation: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Admin',
    [UserRole.VIEWER]: 'Lector',
};


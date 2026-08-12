// ESTADO
export const UserRole = {
    ADMIN: 'ADMIN',
    VIEWER: 'VIEWER',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
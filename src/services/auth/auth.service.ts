import { getLogDescription } from "../../lib/logMessage/logDescriptions";
import { mapUserRowToResponse } from "../../lib/maps/responses/userResponseMapper";
import { signInDb, signOutDb, updatePasswordDb } from "../../repositories/auth/auth.repository";
import { getUserByUsernameDb } from "../../repositories/user/user.repository";
import type { ChangePasswordRequest } from "../../schemas/user.schemas";
import { LogActionType, LogEntityType } from "../../types/log.type";
import { normalizeUsername } from "../../utils/user/normalizeUsername";
import { createLog } from "../logHistory/logHistory.service";

// login
export const signIn = async (username: string, password: string) => {
    // el sistema no posee un inicio de sesion por email, solo por username y contraseña. Es por eso que se establece un email generico
    const userLowercase = normalizeUsername(username)

    const email = `${userLowercase}@interno.local`;

    try {
        await signInDb(email, password);
    } catch (error: any) {
        if (error.code === "invalid_credentials") {
            throw new Error("Usuario o contraseña incorrectos.");
        }
        throw new Error("No se pudo iniciar sesión. Intente nuevamente.");
    }

    const userData = await getUserByUsernameDb(userLowercase);
    if (!userData) throw new Error("Usuario no encontrado.");

    if (!userData.is_active) throw new Error("El usuario está inactivo.");

    const user = mapUserRowToResponse(userData)

    await createLog(user.id, {
        action: LogActionType.LOGIN,
        entityType: LogEntityType.USER,
        entityCode: userLowercase,
        description: getLogDescription(LogActionType.LOGIN, userLowercase)
    });

    return {
        user: user
    };
};

// logout
export const signOut = async (userId: string, username: string) => {
    await createLog(userId, {
        action: LogActionType.LOGOUT,
        entityType: LogEntityType.USER,
        entityCode: username,
        description: getLogDescription(LogActionType.LOGOUT, username)
    });

    await signOutDb();
};

// cambiar contraseña
export const changePassword = async (username: string, data: ChangePasswordRequest): Promise<boolean> => {
    const userLowercase = normalizeUsername(username);
    const internalEmail = `${userLowercase}@interno.local`;

    try {
        await signInDb(internalEmail, data.oldPassword);
    } catch (error: any) {
        if (error.code === "invalid_credentials") {
            throw new Error("La contraseña actual es incorrecta.");
        }
        throw new Error("No se pudo verificar la contraseña. Intente nuevamente.");
    }

    return await updatePasswordDb(data.newPassword);
};


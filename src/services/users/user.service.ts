import type { PaginationParams } from "../../interfaces/params/paginationParams";
import { checkUsernameExistsDb, createUserDb, deleteUserDb, disableUserDB, enableUserDB, getUserByUsernameDb, getUserId, getUserListDb, getUsersDb, updateUserDb } from "../../repositories/user/user.repository";
import { mapUserRowToResponse } from "../../lib/maps/responses/userResponseMapper";
import type { UserLightResponse, UserResponse } from "../../interfaces/responses/userResponse";
import type { CreateUserRequest, UpdateUserRequest } from "../../schemas/user.schemas";
import { mapCreateUserRequestToDto, mapUpdateUserRequestToDto } from "../../lib/maps/requests/userRequestMapper";
import { normalizeUsername } from "../../utils/user/normalizeUsername";
import { getLogDescription } from "../../lib/logMessage/logDescriptions";
import { LogActionType, LogEntityType } from "../../types/log.type";
import { createLog } from "../logHistory/logHistory.service";
import { buildLogDiff } from "../../utils/logUtils/buildLogDiff";

export const getUsers = async (params: PaginationParams = {}) => {
    const { page = 1, limit = 10 } = params;
    const { data, count } = await getUsersDb(params);

    const users = (data ?? []).map(mapUserRowToResponse)

    return {
        data: users,
        total: count ?? 0,
        currentPage: page,
        totalPages: Math.ceil((count ?? 0) / limit)
    };
};

export const getUserByUsername = async (username: string | undefined): Promise<UserResponse> => {

    if (!username) throw new Error("Username no proporcionado");
    const data = await getUserByUsernameDb(username);
    if (!data) throw new Error
    const user = mapUserRowToResponse(data)
    return user

};

export const getUserList = async (): Promise<UserLightResponse[]> => {
    const data = await getUserListDb();
    return (data ?? []).map(u => ({
        fullName: `${u.name} ${u.surname}`,
        username: u.username
    }));
};

// ACCIONES -------------

// crear usuario
export const createUser = async (userId: string, request: CreateUserRequest) => {
    const usernameLowerCase = normalizeUsername(request.username);

    const exists = await checkUsernameExistsDb(usernameLowerCase);

    if (exists) {
        throw new Error("El nombre de usuario ya está en uso.");
    }

    const userDto = mapCreateUserRequestToDto(request);

    try {
        const createdUser = await createUserDb(userDto);

        await createLog(userId, {
            action: LogActionType.CREATE_USER,
            entityType: LogEntityType.USER,
            entityCode: createdUser.username,
            description: getLogDescription(
                LogActionType.CREATE_USER,
                createdUser.username
            ),
            newData: {
                user: `${createdUser.name} ${createdUser.surname} (${createdUser.username})`
            }
        });

        return mapUserRowToResponse(createdUser);

    } catch (error: any) {
        if (error.code === "23505") {
            throw new Error("El nombre de usuario ya está en uso.");
        }

        throw error;
    }
};

// actualizar usuario
export const updateUser = async (currentUserId: string, username: string, request: UpdateUserRequest) => {

    const id = await getUserId(username);

    const user = await getUserByUsername(username);

    const dto = mapUpdateUserRequestToDto(request);

    try {
        const updatedUser = await updateUserDb(id, dto);
        const response = mapUserRowToResponse(updatedUser);

        const { oldData, newData } = buildLogDiff(user, request);
        const hasChanges = Object.keys(newData).length > 0;

        if (hasChanges) {
            await createLog(currentUserId, {
                action: LogActionType.EDIT_USER,
                entityType: LogEntityType.USER,
                entityCode: username,
                description: getLogDescription(
                    LogActionType.EDIT_USER,
                    username
                ),
                oldData,
                newData
            });
        }

        return response;

    } catch (error: any) {
        if (error.code === "23505") {
            throw new Error("El nuevo username ya está en uso.");
        }

        throw error;
    }
};


// habilitar usuario
export const enableUser = async (username: string, currentUserId: string) => {
    const targetUserId = await getUserId(username);
    const user = await getUserByUsernameDb(username);

    if (targetUserId === currentUserId) {
        throw new Error("No puede habilitar su propia cuenta");
    }

    if (user.is_active) {
        throw new Error("El usuario ya se encuentra activo.");
    }

    const enabledUser = await enableUserDB(targetUserId);

    await createLog(currentUserId, {
        action: LogActionType.ENABLE_USER,
        entityType: LogEntityType.USER,
        entityCode: username,
        description: getLogDescription(
            LogActionType.ENABLE_USER,
            username
        ),
        oldData: {
            updatedAt: user.updated_at
        },
        newData: {
            updatedAt: enabledUser.updated_at
        }
    });

    return mapUserRowToResponse(enabledUser);
};

// deshabilitar usuario
export const disableUser = async (username: string, currentUserId: string) => {
    const userId = await getUserId(username);
    const user = await getUserByUsernameDb(username);

    if (userId === currentUserId) {
        throw new Error("No puede deshabilitar su propia cuenta.");
    }

    if (!user.is_active) {
        throw new Error("El usuario ya se encuentra inactivo.");
    }

    const disabledUser = await disableUserDB(userId);

    await createLog(currentUserId, {
        action: LogActionType.DISABLE_USER,
        entityType: LogEntityType.USER,
        entityCode: username,
        description: getLogDescription(
            LogActionType.DISABLE_USER,
            username
        ),
        oldData: {
            updatedAt: user.updated_at
        },
        newData: {
            updatedAt: disabledUser.updated_at
        }
    });

    return mapUserRowToResponse(disabledUser);
};

// borrar usuario (hard delete)
export const deleteUser = async (username: string, currentUserId: string) => {

    const userId = await getUserId(username);
    const user = await getUserByUsernameDb(username);

    if (userId === currentUserId) {
        throw new Error("No puede eliminar su propia cuenta de usuario.");
    }

    try {
        await deleteUserDb(userId);

        await createLog(currentUserId, {
            action: LogActionType.DELETE_USER,
            entityType: LogEntityType.USER,
            entityCode: username,
            description: getLogDescription(
                LogActionType.DELETE_USER,
                username
            ),
            oldData: {
                user: `${user.name} ${user.surname} (${user.username})`
            }
        });

        return true;

    } catch (error: any) {

        const errorMessage = error.message || "";

        if (
            errorMessage.includes("violates foreign key constraint") ||
            error.code === "23503"
        ) {
            throw new Error(
                "No se puede eliminar el usuario porque está asociado a otros registros. Opte por deshabilitarlo."
            );
        }

        throw new Error(error.message);
    }
};
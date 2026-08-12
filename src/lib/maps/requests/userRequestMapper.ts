import type { CreateUserDto, UpdateUserDto } from "../../../interfaces/requests/userRequests";
import type { CreateUserRequest, UpdateUserRequest } from "../../../schemas/user.schemas";
import type { UserRole } from "../../../types/user.type";
import { getTodayDateISO } from "../../../utils/date/getTodayDate";
import { normalizeUsername } from "../../../utils/user/normalizeUsername";

export const mapCreateUserRequestToDto = (dto: CreateUserRequest): CreateUserDto => {

    const username = normalizeUsername(dto.username);

    return {
        name: dto.name.trim(),
        surname: dto.surname.trim(),
        username: username,
        password: dto.password,
        role: dto.role as UserRole
    };
};

export const mapUpdateUserRequestToDto = (dto: UpdateUserRequest): UpdateUserDto => {
    const today = getTodayDateISO();

    return {
        name: dto.name ? dto.name.trim() : undefined,
        surname: dto.surname ? dto.surname.trim() : undefined,
        username: dto.username ? normalizeUsername(dto.username) : undefined,
        role: dto.role ? (dto.role as UserRole) : undefined,
        updated_at: today,
    };
};
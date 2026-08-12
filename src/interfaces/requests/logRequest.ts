import type { ActionType, EntityType } from "../../types/log.type";

export interface CreateLogDto {
    action: ActionType;
    entityType: EntityType;
    entityCode: string;
    description: string;
    oldData?: Record<string, unknown> | null;
    newData?: Record<string, unknown> | null;
    userId: string;
}
import type { ActionType, EntityType } from "../../types/log.type";

export interface LogResponse {
    id: number;
    action: ActionType;
    entityType: EntityType;
    entityCode: string;
    description: string;
    oldData: Record<string, unknown> | null;
    newData: Record<string, unknown> | null;
    timestamp: string | null;
    user: {
        name: string;
        surname: string;
    } | null;
}
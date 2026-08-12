import type { ActionType, EntityType } from "../../types/log.type";

export interface CreateLogParams {
    action: ActionType;
    entityType: EntityType;
    entityCode: string;
    description: string;
    oldData?: Record<string, unknown> | null;
    newData?: Record<string, unknown> | null;
}

export interface GetLogsParams {
    action?: ActionType;
    entityType?: EntityType;
    entityCode?: string;
    dateMode?: "EXACT" | "BEFORE" | "AFTER";
    dateValue?: string;
    page?: number;
    limit?: number;
}
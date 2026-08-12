// ESTADO
export const LossType = {
    LOST: 'LOST',
    STOLEN: 'STOLEN'
} as const;

export type LossType = typeof LossType[keyof typeof LossType];
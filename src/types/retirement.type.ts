// ESTADO
export const RetirementType = {
    OBSOLETE: 'OBSOLETE',
    DAMAGE: 'DAMAGE',
    LOST: 'LOST',
    DONATION: 'DONATION',
    STOLEN: 'STOLEN'
} as const;

export type RetirementType = typeof RetirementType[keyof typeof RetirementType];
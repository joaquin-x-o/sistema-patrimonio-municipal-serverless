import { RetirementType } from "../../types/retirement.type";

;

export const retirementTypeTranslation: Record<RetirementType, string> = {
    [RetirementType.OBSOLETE]: 'Obsoleto',
    [RetirementType.DAMAGE]: 'Dañado',
    [RetirementType.LOST]: 'Pérdida',
    [RetirementType.STOLEN]: 'Robo',
    [RetirementType.DONATION]: 'Donación'
};
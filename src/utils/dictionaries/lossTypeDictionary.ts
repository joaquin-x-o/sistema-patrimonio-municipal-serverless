import { LossType } from "../../types/lost.type";

export const lossTypeTranslation: Record<LossType, string> = {
    [LossType.LOST]: 'Extraviado',
    [LossType.STOLEN]: 'Robado',
};


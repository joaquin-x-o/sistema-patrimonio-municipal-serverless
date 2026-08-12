import { useMemo } from "react";
import { createFilterOptions } from "../../utils/common/createFilterOptions";
import { userRoleTranslation } from "../../utils/dictionaries/userDictionary";
import { categoryTranslations, conditionTranslations } from "../../utils/dictionaries/productDictionaries";
import { lossTypeTranslation } from "../../utils/dictionaries/lossTypeDictionary";
import { retirementTypeTranslation } from "../../utils/dictionaries/retirementTypeDictionary";

// hook para extraer todas las opciones posibles que se pueden utilizar en formularios
export function useFormOptions() {

    // Opciones de producto
    const conditionOptions = useMemo(() => createFilterOptions(conditionTranslations, "Seleccionar condición física"), []);
    const categoryOptions = useMemo(() => createFilterOptions(categoryTranslations, "Seleccionar condición física"), []);

    // Opciones de usuario
    const roleOptions = useMemo(() => createFilterOptions(userRoleTranslation, "Seleccionar rol"), []);

    // Opciones de reportes
    const lossTypeOptions = useMemo(() => createFilterOptions(lossTypeTranslation, "Seleccionar rol"), []);
    const retirementTypeOptions = useMemo(() => createFilterOptions(retirementTypeTranslation, "Seleccionar rol"), []);

    return {
        conditionOptions,
        categoryOptions,
        roleOptions,
        lossTypeOptions,
        retirementTypeOptions
    };
}
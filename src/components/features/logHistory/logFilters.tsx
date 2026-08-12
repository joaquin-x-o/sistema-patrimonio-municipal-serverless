// LogFilters.tsx
import { useState } from "react";
import type { ActionType, EntityType } from "../../../types/log.type";
import type { DateFilterOptions } from "../../../types/dataFilterOptions.type";
import { FilterPanel } from "../../ui/Filters/FilterPanel";
import { SelectFilter } from "../../ui/Filters/SelectFilter";
import { createFilterOptions } from "../../../utils/common/createFilterOptions";
import { DateFilter } from "../../ui/Filters/DateFilter";
import { FilterActions } from "../../ui/Filters/FilterActions";
import type { FilterProps } from "../../../interfaces/filterProps";
import { actionTypeTranslation, entityTypeTranslation } from "../../../utils/dictionaries/logDictionaries";

export function LogFilters({
    searchParams,
    setSearchParams,
    setCurrentPage,
    onApply,
}: FilterProps) {
    const [showFilters, setShowFilters] = useState(false);

    const [action, setAction] = useState<ActionType | "">(
        (searchParams.get("accion") as ActionType) || ""
    );

    const [entityType, setEntityType] = useState<EntityType | "">(
        (searchParams.get("entidad") as EntityType) || ""
    );

    const [dateFilterMode, setDateFilterMode] = useState<DateFilterOptions>(
        (searchParams.get("modoFecha") as DateFilterOptions) || "BEFORE"
    );

    const [dateFilterValue, setDateFilterValue] = useState(
        searchParams.get("fecha") || ""
    );

    const handleApplyFilters = () => {
        const params = new URLSearchParams();

        if (action) {
            params.set("accion", action);
        }

        if (entityType) {
            params.set("entidad", entityType);
        }

        if (dateFilterValue) {
            params.set("modoFecha", dateFilterMode);
            params.set("fecha", dateFilterValue);
        }

        setCurrentPage(1);
        setSearchParams(params);
        onApply?.();
    };

    const handleClearFilters = () => {
        setAction("");
        setEntityType("");
        setDateFilterMode("BEFORE");
        setDateFilterValue("");
        setSearchParams(new URLSearchParams());
        setCurrentPage(1);
        onApply?.();
    }

    return (
        <FilterPanel
            title="Filtros de búsqueda"
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
        >
            <SelectFilter<ActionType>
                label="Acción"
                value={action}
                options={createFilterOptions(
                    actionTypeTranslation,
                    "Todas las acciones"
                )}
                onChange={setAction}
            />

            <SelectFilter<EntityType>
                label="Entidad"
                value={entityType}
                options={createFilterOptions(
                    entityTypeTranslation,
                    "Todas las entidades"
                )}
                onChange={setEntityType}
            />

            <DateFilter
                label="Fecha de registro"
                mode={dateFilterMode}
                value={dateFilterValue}
                onModeChange={setDateFilterMode}
                onValueChange={setDateFilterValue}
            />

            <FilterActions
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />
        </FilterPanel>
    );
}
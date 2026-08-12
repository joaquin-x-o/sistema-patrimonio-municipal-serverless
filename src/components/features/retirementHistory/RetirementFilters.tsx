import { useState } from "react";
import type { RetirementType } from "../../../types/retirement.type";
import type { DateFilterOptions } from "../../../types/dataFilterOptions.type";
import { FilterPanel } from "../../ui/Filters/FilterPanel";
import { SelectFilter } from "../../ui/Filters/SelectFilter";
import { createFilterOptions } from "../../../utils/common/createFilterOptions";
import { DateFilter } from "../../ui/Filters/DateFilter";
import { FilterActions } from "../../ui/Filters/FilterActions";
import type { FilterProps } from "../../../interfaces/filterProps";
import { retirementTypeTranslation } from "../../../utils/dictionaries/retirementTypeDictionary";

export function RetirementFilters({ searchParams, setSearchParams, setCurrentPage, onApply }: FilterProps) {
    const [showFilters, setShowFilters] = useState(false);

    const [retirementType, setRetirementTypeFilter] = useState<RetirementType | "">(
        (searchParams.get("tipo") as RetirementType) || ""
    );
    const [dateFilterMode, setDateFilterMode] = useState<DateFilterOptions>(
        (searchParams.get("modoFecha") as DateFilterOptions) || "BEFORE"
    );
    const [dateFilterValue, setDateFilterValue] = useState(
        searchParams.get("fecha") || ""
    );

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        if (retirementType) params.set("tipo", retirementType);
        if (dateFilterValue) {
            params.set("modoFecha", dateFilterMode);
            params.set("fecha", dateFilterValue);
        }
        setCurrentPage(1);
        setSearchParams(params);
        onApply?.()
    };

    const handleClearFilters = () => {
        setRetirementTypeFilter("");
        setDateFilterMode("BEFORE");
        setDateFilterValue("");
        setSearchParams(new URLSearchParams());
        setCurrentPage(1);
        onApply?.()
    }

    return (
        <FilterPanel title="Filtros de búsqueda" isOpen={showFilters} onToggle={() => setShowFilters(!showFilters)}>
            <SelectFilter<RetirementType>
                label="Tipo de baja"
                value={retirementType}
                options={createFilterOptions(retirementTypeTranslation, "Todas las tipos de baja")}
                onChange={setRetirementTypeFilter}
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
import { useState } from "react";
import type { LossType } from "../../../types/lost.type";
import type { DateFilterOptions } from "../../../types/dataFilterOptions.type";
import { FilterPanel } from "../../ui/Filters/FilterPanel";
import { SelectFilter } from "../../ui/Filters/SelectFilter";
import { createFilterOptions } from "../../../utils/common/createFilterOptions";
import { DateFilter } from "../../ui/Filters/DateFilter";
import { FilterActions } from "../../ui/Filters/FilterActions";
import type { FilterProps } from "../../../interfaces/filterProps";
import { lossTypeTranslation } from "../../../utils/dictionaries/lossTypeDictionary";

export function LossFilters({
    searchParams,
    setSearchParams,
    setCurrentPage,
    onApply,
}: FilterProps) {
    const [showFilters, setShowFilters] = useState(false);

    const [lossType, setLossType] = useState<LossType | "">(
        (searchParams.get("tipo") as LossType) || ""
    );

    const [dateFilterMode, setDateFilterMode] = useState<DateFilterOptions>(
        (searchParams.get("modoFecha") as DateFilterOptions) || "BEFORE"
    );

    const [dateFilterValue, setDateFilterValue] = useState(
        searchParams.get("fecha") || ""
    );

    const handleApplyFilters = () => {
        const params = new URLSearchParams();

        if (lossType) {
            params.set("tipo", lossType);
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
        setLossType("");
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
            <SelectFilter<LossType>
                label="Tipo de extravío"
                value={lossType}
                options={createFilterOptions(
                    lossTypeTranslation,
                    "Todos los tipos de extravío"
                )}
                onChange={setLossType}
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
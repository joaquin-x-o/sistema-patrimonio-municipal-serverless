// components/features/products/ProductFilters.tsx
import { useState } from "react";
import type { ProductCategory, ProductCondition, ProductStatus } from "../../../types/product.type";
import type { DateFilterOptions } from "../../../types/dataFilterOptions.type";
import { categoryTranslations, conditionTranslations, statusTranslations } from "../../../utils/dictionaries/productDictionaries";
import { createFilterOptions } from "../../../utils/common/createFilterOptions";
import { FilterPanel } from "../../ui/Filters/FilterPanel";
import { SelectFilter } from "../../ui/Filters/SelectFilter";
import { DateFilter } from "../../ui/Filters/DateFilter";
import { FilterActions } from "../../ui/Filters/FilterActions";
import type { FilterProps } from "../../../interfaces/filterProps";

export function ProductFilters({ searchParams, setSearchParams, setCurrentPage, onApply }: FilterProps) {

    // estado para manejar los filtros
    const [showFilters, setShowFilters] = useState(false);

    // estados para manejar los filtros seleccionados
    const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "">(
        (searchParams.get("categoria") as ProductCategory) || ""
    );
    const [conditionFilter, setConditionFilter] = useState<ProductCondition | "">(
        (searchParams.get("condicion") as ProductCondition) || ""
    );
    const [statusFilter, setStatusFilter] = useState<ProductStatus | "">(
        (searchParams.get("estado") as ProductStatus) || ""
    );
    const [dateFilterMode, setDateFilterMode] = useState<DateFilterOptions>(
        (searchParams.get("modoFecha") as DateFilterOptions) || "BEFORE"
    );
    const [dateFilterValue, setDateFilterValue] = useState(
        searchParams.get("fecha") || ""
    );

    // funcion para aplicar los filtros
    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        if (categoryFilter) params.set("categoria", categoryFilter);
        if (conditionFilter) params.set("condicion", conditionFilter);
        if (statusFilter) params.set("estado", statusFilter);
        if (dateFilterValue) {
            params.set("modoFecha", dateFilterMode);
            params.set("fecha", dateFilterValue);
        }
        setCurrentPage(1);
        setSearchParams(params);
        onApply?.();
    };

    // funcion para limpiar los filtros
    const handleClearFilters = () => {
        setCategoryFilter("");
        setConditionFilter("");
        setStatusFilter("");
        setDateFilterValue("");
        setSearchParams(new URLSearchParams());
        setCurrentPage(1);
        onApply?.();
    };

    return (
        <FilterPanel
            title="Filtros de búsqueda"
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
        >
            <SelectFilter<ProductCategory>
                label="Categoría"
                value={categoryFilter}
                options={createFilterOptions(categoryTranslations, "Todas las categorías")}
                onChange={setCategoryFilter}
            />
            <SelectFilter<ProductCondition>
                label="Condición"
                value={conditionFilter}
                options={createFilterOptions(conditionTranslations, "Todas las condiciones")}
                onChange={setConditionFilter}
            />
            <SelectFilter<ProductStatus>
                label="Estado"
                value={statusFilter}
                options={createFilterOptions(statusTranslations, "Todos los estados")}
                onChange={setStatusFilter}
            />
            <DateFilter
                label="Fecha de registro"
                mode={dateFilterMode}
                value={dateFilterValue}
                onModeChange={setDateFilterMode}
                onValueChange={setDateFilterValue}
            />
            <FilterActions onApply={handleApplyFilters} onClear={handleClearFilters} />
        </FilterPanel>
    );
}
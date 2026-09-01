import { useSearchParams } from "react-router-dom";
import { useScrollToRef } from "../../hooks/common/useScrollToRef";
import { useEffect, useState } from "react";
import type { RetirementType } from "../../types/retirement.type";
import type { DateFilterOptions } from "../../types/dataFilterOptions.type";
import { useRetirementReport } from "../../hooks/query/retirementHistory/useRetirementReport";
import { DetailsLayout } from "../../components/layout/DetailsLayout";
import { DetailCard } from "../../components/ui/Cards/DetailCard";
import { TableCard } from "../../components/ui/Cards/TableCard";
import { RetirementFilters } from "../../components/features/retirementHistory/RetirementFilters";
import { ExcelButton } from "../../components/ui/Button/ExcelButton";
import { RetirementHistoryColumnNames } from "../../components/features/retirementHistory/RetirementHistoryColumnNames";
import { InfoField } from "../../components/ui/DataDisplay/InfoField";
import { formatCalendarDateAR } from "../../utils/date/formattedDate";
import { useExportRetirements } from "../../hooks/query/retirementHistory/useExportRetirementExport";

export default function RetirementReport() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { ref: tableRef, scrollToRef } = useScrollToRef<HTMLDivElement>();
    const [currentPage, setCurrentPage] = useState(1);
    const [shouldScroll, setShouldScroll] = useState(false);

    const currentYear = new Date().getFullYear();

    const type = searchParams.get("tipo") as RetirementType || undefined;
    const dateMode = searchParams.get("modoFecha") as DateFilterOptions || undefined;
    const dateValue = searchParams.get("fecha") || undefined;

    const { data, stats, total, totalPages, loading } = useRetirementReport({
        type,
        dateMode,
        dateValue,
        page: currentPage,
        limit: 10
    });

    const { handleExportExcel, isExporting } = useExportRetirements();

    const tableIsEmpty = !data || data.length === 0;

    const lastRetirementProduct = stats?.lastReport;


    useEffect(() => {
        if (!loading && shouldScroll) {
            scrollToRef();
            setShouldScroll(false);
        }
    }, [loading]);

    return (
        <DetailsLayout
            title="Gestión de Reportes"
            sections={[
                <DetailCard
                    label={`Productos dados de baja este año (${currentYear})`}
                    value={stats?.currentYearRetirements ?? 0}
                    showEdit={false}
                    title="Reporte de productos dados de baja"
                    centerTitle
                />,

                <DetailCard
                    label="Productos dados de baja en total"
                    value={stats?.totalRetirements ?? 0}
                    showEdit={false}
                />,


                <DetailCard
                    title="Último producto dado de baja"
                    showEdit={false}
                >
                    <InfoField
                        label="Producto" value={lastRetirementProduct ? `${lastRetirementProduct.product.name} (${lastRetirementProduct.product.productCode})`
                            : "-"
                        }
                    />

                    <InfoField
                        label="Fecha"
                        value={lastRetirementProduct ? formatCalendarDateAR(lastRetirementProduct.transactionDate) : "-"}
                    />

                    <InfoField
                        label="Motivo"
                        value={lastRetirementProduct?.retirementReason ?? "-"}
                    />
                </DetailCard>,


                <TableCard
                    title="Historial de bajas"
                    total={total}
                    columns={RetirementHistoryColumnNames}
                    data={data}
                    loading={loading}
                    tableRef={tableRef}
                    filters={
                        <RetirementFilters
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            setCurrentPage={setCurrentPage}
                            onApply={() => setShouldScroll(true)}
                        />
                    }
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: (page) => {
                            setCurrentPage(page);
                            setShouldScroll(true);
                        }
                    }}
                />,
            ]}

            floatingAction={
                !tableIsEmpty ? (
                    <ExcelButton onClick={handleExportExcel} isLoading={isExporting} />
                ) : undefined
            }
        />
    );
}
import { useSearchParams } from "react-router-dom";
import { useScrollToRef } from "../../hooks/common/useScrollToRef";
import { useEffect, useState } from "react";
import type { LossType } from "../../types/lost.type";
import type { DateFilterOptions } from "../../types/dataFilterOptions.type";
import { DetailsLayout } from "../../components/layout/DetailsLayout";
import { DetailCard } from "../../components/ui/Cards/DetailCard";
import { TableCard } from "../../components/ui/Cards/TableCard";
import { LossFilters } from "../../components/features/lossHistory/LossFilters";
import { ExcelButton } from "../../components/ui/Button/ExcelButton";
import { LossHistoryColumnNames } from "../../components/features/lossHistory/LossHistoryColumnNames";
import { InfoField } from "../../components/ui/DataDisplay/InfoField";
import { formatCalendarDateAR } from "../../utils/date/formattedDate";
import { useLossReport } from "../../hooks/query/lossHistory/useLossReport";
import { useExportLosses } from "../../hooks/query/lossHistory/useExportLossReport";

export default function LossReport() {

    const [searchParams, setSearchParams] = useSearchParams();
    const { ref: tableRef, scrollToRef } = useScrollToRef<HTMLDivElement>();
    const [currentPage, setCurrentPage] = useState(1);
    const [shouldScroll, setShouldScroll] = useState(false);

    const type = searchParams.get("tipo") as LossType || undefined;
    const dateMode = searchParams.get("modoFecha") as DateFilterOptions || undefined;
    const dateValue = searchParams.get("fecha") || undefined;

    const { data, stats, total, totalPages, loading } = useLossReport({
        type,
        dateMode,
        dateValue,
        page: currentPage,
        limit: 10
    });

    const lastLostProduct = stats?.lastLossReport;
    const tableIsEmpty = !data || data.length === 0;

    const { handleExportExcel, isExporting } = useExportLosses();

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
                // PERDIDAS TOTALES
                <DetailCard
                    title="Reporte de productos extraviados"
                    centerTitle
                    label="Productos extraviados en total"
                    value={stats?.totalLossReports}
                    showEdit={false}
                />,

                // ÚLTIMO PRODUCTO PERDIDO
                <DetailCard
                    title="Último producto extraviado"
                    showEdit={false}
                >
                    <InfoField
                        label="Producto" value={lastLostProduct ? `${lastLostProduct.product.name} (${lastLostProduct.product.productCode})`
                            : "-"
                        }
                    />

                    <InfoField
                        label="Fecha"
                        value={lastLostProduct ? formatCalendarDateAR(lastLostProduct.lossDate) : "-"}
                    />

                    <InfoField
                        label="Motivo"
                        value={lastLostProduct?.lossDetails ?? "-"}
                    />
                </DetailCard>,

                // TABLA
                <TableCard
                    title="Historial de extravíos"
                    total={total}
                    columns={LossHistoryColumnNames}
                    data={data}
                    tableRef={tableRef}
                    filters={
                        <LossFilters
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
                />
            ]}

            floatingAction={
                !tableIsEmpty ? (
                    <ExcelButton onClick={handleExportExcel} isLoading={isExporting} />
                ) : undefined
            }
        />
    );
}
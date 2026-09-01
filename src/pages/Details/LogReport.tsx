// LogReport.tsx
import { useSearchParams } from "react-router-dom";
import { useScrollToRef } from "../../hooks/common/useScrollToRef";
import { useEffect, useState } from "react";
import type { ActionType, EntityType } from "../../types/log.type";
import type { DateFilterOptions } from "../../types/dataFilterOptions.type";
import { DetailsLayout } from "../../components/layout/DetailsLayout";
import { DetailCard } from "../../components/ui/Cards/DetailCard";
import { TableCard } from "../../components/ui/Cards/TableCard";
import { InfoField } from "../../components/ui/DataDisplay/InfoField";
import { formatDateAR } from "../../utils/date/formattedDate";
import { useLog } from "../../hooks/query/logHistory/useLogHistory";
import { LogHistoryColumnNames } from "../../components/features/logHistory/logHistoryColumnNames";
import { LogFilters } from "../../components/features/logHistory/logFilters";
import { actionTypeTranslation, entityTypeTranslation } from "../../utils/dictionaries/logDictionaries";

export default function LogReport() {

    const [searchParams, setSearchParams] = useSearchParams();
    const { ref: tableRef, scrollToRef } = useScrollToRef<HTMLDivElement>();
    const [currentPage, setCurrentPage] = useState(1);
    const [shouldScroll, setShouldScroll] = useState(false);

    const action = searchParams.get("accion") as ActionType || undefined;
    const entityType = searchParams.get("entidad") as EntityType || undefined;
    const entityCode = searchParams.get("codigo") || undefined;
    const dateMode = searchParams.get("modoFecha") as DateFilterOptions || undefined;
    const dateValue = searchParams.get("fecha") || undefined;

    const { data, stats, total, totalPages, loading } = useLog({
        action,
        entityType,
        entityCode,
        dateMode,
        dateValue,
        page: currentPage,
        limit: 10
    });

    const lastLog = stats?.lastLog;

    const actionTranslated = lastLog && actionTypeTranslation[lastLog.action];
    const entityTranslated = lastLog && entityTypeTranslation[lastLog.entityType];


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
                // TOTAL DE REGISTROS
                <DetailCard
                    title="Reporte de auditoría"
                    centerTitle
                    label="Eventos registrados en total"
                    value={stats?.totalLogs}
                    showEdit={false}
                />,

                // ÚLTIMO EVENTO REGISTRADO
                <DetailCard
                    title="Último evento registrado"
                    showEdit={false}
                >
                    <InfoField
                        label="Acción"
                        value={actionTranslated ?? "-"}
                    />

                    <InfoField
                        label="Entidad"
                        value={lastLog ? `${entityTranslated} (${lastLog.entityCode})` : "-"}
                    />

                    <InfoField
                        label="Usuario"
                        value={lastLog?.user ? `${lastLog.user.name} ${lastLog.user.surname}` : "-"}
                    />

                    <InfoField
                        label="Fecha"
                        value={lastLog?.timestamp ? formatDateAR(lastLog.timestamp) : "-"}
                    />

                    <InfoField
                        label="Descripción"
                        value={lastLog?.description ?? "-"}
                    />
                </DetailCard>,

                // TABLA
                <TableCard
                    title="Historial de auditoría"
                    total={total}
                    columns={LogHistoryColumnNames}
                    data={data}
                    tableRef={tableRef}
                    filters={
                        <LogFilters
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
        />
    );
}
import { useParams } from "react-router-dom";
import { DetailsLayout } from "../../components/layout/DetailsLayout";
import { ExcelButton } from "../../components/ui/Button/ExcelButton";
import { DetailCard } from "../../components/ui/Cards/DetailCard";
import { TableCard } from "../../components/ui/Cards/TableCard";
import { InfoField } from "../../components/ui/DataDisplay/InfoField";
import { formatCalendarDateAR } from "../../utils/date/formattedDate";
import { useState } from "react";
import { MaintenanceHistoryColumnNames } from "../../components/features/maintenanceHistory/MaintenanceHistoryColumnNames";
import { useProduct } from "../../hooks/query/products/useProduct";
import { useMaintenanceReport } from "../../hooks/query/maintenanceHistory/useMaintenanceReport";
import { useExportMaintenance } from "../../hooks/query/maintenanceHistory/useExportMaintenanceReport";

export default function MaintenanceReport() {

    const { productCode } = useParams<{ productCode: string }>();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: productDetails } = useProduct(productCode);
    const { data, lastMaintenance, total, totalPages, loading } = useMaintenanceReport(productCode, currentPage);
    const { handleExportExcel, isExporting } = useExportMaintenance(Number(productCode), productDetails?.name ?? "");

    const tableIsEmpty = !data || data.length === 0;

    return (
        <DetailsLayout
            title="Gestión de Reportes"
            sections={[
                // INFORMACION DEL PRODUCTO
                <DetailCard
                    title="Reporte de mantenimiento"
                    centerTitle
                    showEdit={false}
                >
                    <InfoField label="Producto" value={productDetails?.name} />
                    <InfoField label="Código" value={productDetails?.productCode} />
                </DetailCard>,

                // TOTAL ARREGLOS
                <DetailCard
                    label="Arreglos totales"
                    value={total}
                    showEdit={false}
                />,

                // ULTIMO MANTENIMIENTO
                <DetailCard
                    title="Último mantenimiento"
                    showEdit={false}
                >
                    <InfoField label="Fecha de reparación" value={formatCalendarDateAR(lastMaintenance?.repairDate)} />
                    <InfoField label="Motivo" value={lastMaintenance?.breakdownReason} />
                    <InfoField label="Reparación" value={lastMaintenance?.repairDescription} />
                </DetailCard>,

                // HISTORIAL
                <TableCard
                    title="Historial de mantenimiento"
                    total={total}
                    columns={MaintenanceHistoryColumnNames}
                    data={data}
                    loading={loading}
                    pagination={{
                        currentPage,
                        totalPages: totalPages,
                        onPageChange: setCurrentPage
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
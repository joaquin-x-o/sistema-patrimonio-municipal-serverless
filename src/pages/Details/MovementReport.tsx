import { useState } from "react";
import { useParams } from "react-router-dom";
import { DetailCard } from "../../components/ui/Cards/DetailCard";
import { DetailsLayout } from "../../components/layout/DetailsLayout";
import { InfoField } from "../../components/ui/DataDisplay/InfoField";
import { TableCard } from "../../components/ui/Cards/TableCard";
import { ExcelButton } from "../../components/ui/Button/ExcelButton";
import { handleExportExcel } from "../../utils/common/handleExportExcel";
import { MovementHistoryColumnNames } from "../../components/features/movementHistory/MovementHistoryColumnNames";
import { useProduct } from "../../hooks/query/products/useProduct";
import { useMovementReport } from "../../hooks/query/movementHistory/useMovementHistoryReport";

export default function MovementReport() {
    const { productCode } = useParams<{ productCode: string }>();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: productDetails } = useProduct(productCode);
    const { data, lastMovement, total, totalPages, loading } = useMovementReport(productCode, currentPage);

    return (
        <DetailsLayout
            title="Gestión de Reportes"
            sections={[
                // INFORMACION DEL PRODUCTO
                <DetailCard title="Reporte de traslado" centerTitle showEdit={false}>
                    <InfoField label="Producto" value={productDetails?.name} />
                    <InfoField label="Código" value={productDetails?.productCode} />
                </DetailCard>,

                // TOTAL TRASLADOS
                <DetailCard
                    label="Número de traslados"
                    value={total}
                    showEdit={false}
                />,

                // UBICACION
                <DetailCard title="Ubicación" showEdit={false}>
                    <InfoField
                        label="Ubicación actual"
                        value={`${lastMovement?.destinationDepartment.name} (${lastMovement?.destinationDepartment.departmentCode})`}
                    />
                    <InfoField
                        label="Ubicación previa"
                        value={`${lastMovement?.originDepartment.name} (${lastMovement?.originDepartment.departmentCode})`}
                    />
                </DetailCard>,

                // HISTORIAL
                <TableCard
                    title="Historial de traslados"
                    total={total}
                    columns={MovementHistoryColumnNames}
                    data={data}
                    loading={loading}
                    pagination={{
                        currentPage,
                        totalPages: totalPages,
                        onPageChange: setCurrentPage
                    }}
                />,
            ]}
            floatingAction={<ExcelButton onClick={handleExportExcel} />}
        />
    );
}
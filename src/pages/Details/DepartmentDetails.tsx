import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DetailsLayout } from "../../components/layout/DetailsLayout";
import { DetailCard } from "../../components/ui/Cards/DetailCard";
import { InfoField } from "../../components/ui/DataDisplay/InfoField";
import { TableCard } from "../../components/ui/Cards/TableCard";
import { ExcelButton } from "../../components/ui/Button/ExcelButton";
import { handleExportExcel } from "../../utils/common/handleExportExcel";
import { ProductColumnNames } from "../../components/features/products/ProductColumnNames";
import { DepartmentBadgeStatus } from "../../components/features/departments/DepartmentBadgeStatus";
import { getStatusRoute } from "../../utils/common/getStatusRoute";
import { useAuth } from "../../hooks/auth/useAuth";
import { UserRole } from "../../types/user.type";
import { useDepartment } from "../../hooks/query/departments/useDepartment";
import { ProductFilters } from "../../components/features/products/ProductFilters";
import { useScrollToRef } from "../../hooks/common/useScrollToRef";
import type { DateFilterOptions } from "../../types/dataFilterOptions.type";
import type { ProductCategory, ProductCondition, ProductStatus } from "../../types/product.type";
import { LoadingContainer } from "../../components/ui/Feedback/LoadingContainer";
import { formatDateAR } from "../../utils/date/formattedDate";

export default function DepartmentDetails() {
    const { departmentCode } = useParams<{ departmentCode: string }>();

    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    const { ref: tableRef, scrollToRef } = useScrollToRef<HTMLDivElement>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [shouldScroll, setShouldScroll] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // obtener filtros de busqueda del producto
    const category = searchParams.get("categoria") as ProductCategory || undefined;
    const condition = searchParams.get("condicion") as ProductCondition || undefined;
    const status = searchParams.get("estado") as ProductStatus || undefined;
    const dateMode = searchParams.get("modoFecha") as DateFilterOptions || undefined;
    const dateValue = searchParams.get("fecha") || undefined;

    const { department: departmentDetails, products, total: productTotal, totalPages, error, loading } = useDepartment({ departmentCode, page: currentPage, limit: 20, category, condition, status, dateMode, dateValue });

    const departmentStatus = departmentDetails?.isActive;

    useEffect(() => {
        if (!loading && shouldScroll) {
            scrollToRef();
            setShouldScroll(false);
        }
    }, [loading]);

    if (loading && !departmentDetails) return (
        <LoadingContainer />
    );

    if (error) throw new Error(error);

    return (
        <DetailsLayout
            title="Gestión de Áreas"
            sections={[
                // INFORMACION PRINCIPAL
                <DetailCard
                    title={`${departmentDetails?.name} (${departmentDetails?.departmentCode})`}
                    centerTitle
                    showEdit={isAdmin}
                    onEdit={() => navigate("/area/editar", { state: { departmentCode: departmentDetails?.departmentCode } })}
                >
                    <InfoField label="Nombre" value={departmentDetails?.name} />
                    <InfoField label="Código" value={departmentDetails?.departmentCode} />
                    <InfoField label="Responsable" value={departmentDetails?.responsibleName} />
                </DetailCard>,

                // ESTADO
                <DetailCard
                    showEdit={isAdmin}
                    onEdit={() => navigate(getStatusRoute(departmentStatus ?? false, "area"), { state: { departmentCode: departmentDetails?.departmentCode } })}

                >
                    <InfoField label="Estado" value={<DepartmentBadgeStatus status={departmentStatus ?? false} />} />
                    <InfoField label="Desde" value={formatDateAR(departmentDetails?.updatedAt)} />
                </DetailCard>,

                // TABLA DE PRODUCTOS
                <TableCard
                    title="Productos"
                    total={productTotal}
                    columns={ProductColumnNames}
                    tableRef={tableRef}
                    filters={<ProductFilters
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        setCurrentPage={setCurrentPage}
                        onApply={() => setShouldScroll(true)}
                    />}
                    data={products}
                    loading={loading}
                    pagination={{
                        currentPage,
                        totalPages: totalPages,
                        onPageChange: (page) => {
                            setCurrentPage(page);
                            setShouldScroll(true);
                        }
                    }}
                />,
            ]}

            floatingAction={<ExcelButton onClick={handleExportExcel} />}
        />
    );
}
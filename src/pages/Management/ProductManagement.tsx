import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "../../hooks/auth/useAuth";
import { useScrollToRef } from "../../hooks/common/useScrollToRef";

import type { ProductShortResponse } from "../../interfaces/responses/productResponses";
import type { ProductCategory, ProductCondition, ProductStatus } from "../../types/product.type";
import type { DateFilterOptions } from "../../types/dataFilterOptions.type";
import { UserRole } from "../../types/user.type";


import type { ButtonGroupAction } from "../../components/ui/Button/ButtonGroup";
import { ManagementLayout } from "../../components/layout/ManagementLayout";
import { BarGraphCard } from "../../components/ui/Cards/ChartCard";
import { Bar } from "../../components/ui/DataDisplay/BarGraph";
import { conditionTranslations } from "../../utils/dictionaries/productDictionaries";
import { QuickActionsCard } from "../../components/ui/Cards/QuickActionsCard";
import { ProductColumnNames } from "../../components/features/products/ProductColumnNames";
import { TableCard } from "../../components/ui/Cards/TableCard";
import { ExcelButton } from "../../components/ui/Button/ExcelButton";
import { ProductFilters } from "../../components/features/products/ProductFilters";

import { handleExportExcel } from "../../utils/common/handleExportExcel";
import { getProducts } from "../../services/products/product.service";
import { useProductCountByCondition } from "../../hooks/query/products/useProductCountByCondition";

export default function ProductManagement() {
    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState<ProductShortResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const { ref: tableRef, scrollToRef } = useScrollToRef<HTMLDivElement>();

    const { data: productsByCondition, loading: conditionLoading } = useProductCountByCondition();
    const totalProducts = productsByCondition.reduce((total, item) => total + item.count, 0);

    useEffect(() => {
        if (!loading && shouldScroll) {
            scrollToRef();
            setShouldScroll(false);
        }
    }, [loading]);

    // cargar productos segun filtros
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const category = searchParams.get("categoria") as ProductCategory || undefined;
                const condition = searchParams.get("condicion") as ProductCondition || undefined;
                const status = searchParams.get("estado") as ProductStatus || undefined;
                const dateMode = searchParams.get("modoFecha") as DateFilterOptions || undefined;
                const dateValue = searchParams.get("fecha") || undefined;

                const response = await getProducts({ category, condition, status, dateMode, dateValue, page: currentPage, limit: 20 });

                console.log("PAGE:", currentPage);
                console.log(
                    "PRODUCTS:",
                    response.data?.map(p => p.productCode)
                );

                setData(response.data ?? []);
                setTotalItems(response.total);
                setTotalPages(response.totalPages);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [searchParams, currentPage]);

    // acciones rapidas de productos
    const quickActions: ButtonGroupAction[] = [
        { label: "Crear producto", to: "/producto/crear", variant: "primary" },
        { label: "Modificar estado de producto", to: "/producto/editar-estado", variant: "primary" },
        { label: "Transferir producto", to: "/producto/transferir", variant: "primary" },
        { label: "Revisar producto", to: "/producto/revisar", variant: "primary" },
        { label: "Dar de baja", to: "/producto/dar-de-baja", variant: "danger" },
    ];

    return (
        <ManagementLayout
            title="Gestión de Productos"

            topSection={
                <BarGraphCard title="Productos según su condición" loading={conditionLoading}>
                    {productsByCondition.map(({ physicalCondition, count }) => (
                        <Bar
                            key={physicalCondition}
                            label={conditionTranslations[physicalCondition] ?? physicalCondition}
                            value={count}
                            max={totalProducts}
                        />
                    ))}
                </BarGraphCard>
            }

            sideSection={isAdmin && <QuickActionsCard actions={quickActions} sidebarKey="productos" />}

            content={
                <TableCard
                    title="Productos"
                    total={totalItems}
                    columns={ProductColumnNames}
                    data={data}
                    loading={loading}
                    tableRef={tableRef}
                    filters={<ProductFilters
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        setCurrentPage={setCurrentPage}
                        onApply={() => setShouldScroll(true)}
                    />}
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: (page) => {
                            setCurrentPage(page);
                            setShouldScroll(true);
                        }
                    }}
                />
            }
            floatingAction={<ExcelButton onClick={handleExportExcel} />}
        />
    );
}
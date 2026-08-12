import { SummaryCard } from "../../components/ui/Cards/SummaryCard";
import { TableCard } from "../../components/ui/Cards/TableCard";
import { QuickActionsCard } from "../../components/ui/Cards/QuickActionsCard";
import { BarGraphCard } from "../../components/ui/Cards/ChartCard";


import { Bar } from "../../components/ui/DataDisplay/BarGraph";
import { type ButtonGroupAction } from "../../components/ui/Button/ButtonGroup";
import { useSidebar } from "../../components/layout/sidebar/SidebarProvider";
import { ProductColumnNames } from "../../components/features/products/ProductColumnNames";
import { DepartmentNameFormat } from "../../components/features/departments/DepartmentNameFormat";


import { Package, AlertTriangle, FileDown } from "lucide-react";
import { useAuth } from "../../hooks/auth/useAuth";
import { UserRole } from "../../types/user.type";
import { useProducts } from "../../hooks/query/products/useProducts";
import { useDashboardStats } from "../../hooks/query/stats/useDashboardStats";



export default function Dashboard() {
    const { isExpanded, setIsExpanded } = useSidebar();
    const { data: products, total: totalProducts, loading } = useProducts({ limit: 10 });
    const { data: dashboardStats, loading: dashboardStatsLoading } = useDashboardStats();

    const totalProductsToReview = dashboardStats?.totalProductsToReview;

    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    // datos para las cards de resumen
    const summaryCards = [
        {
            title: "Total Productos",
            value: totalProducts,
            icon: <Package size={70} strokeWidth={1.5} />,
            bgColor: "bg-primary-hover",
            to: "/producto/gestion-productos"
        },
        {
            title: "Pendientes Revisión",
            value: totalProductsToReview,
            icon: <AlertTriangle size={70} strokeWidth={1.5} />,
            bgColor: "bg-warning",
            to: "/producto/pendientes-revision"
        },
        {
            title: "Bajas del Año",
            value: dashboardStats?.totalRetirements,
            icon: <FileDown size={70} strokeWidth={1.5} />,
            bgColor: "bg-danger",
            to: "/reportes/bajas"
        }
    ];

    // acciones rapidas del dashboard
    const quickActions: ButtonGroupAction[] = [
        { label: "Crear producto", to: "/producto/crear", variant: "primary" },
        { label: "Modificar estado de producto", to: "/producto/editar-estado", variant: "primary" },
        { label: "Transferir producto", to: "/producto/transferir", variant: "primary" },
    ];

    // estadisticas de gestion por departamento
    const departmentStats = dashboardStats?.departmentStats ?? [];

    const maxDepartmentProducts = Math.max(
        ...departmentStats.map(d => d.productCount),
        0
    );

    return (
        <div className="flex flex-col gap-8 md:px-6 lg:px-5 py-4" >
            {/* RESUMEN PRINCIPAL */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {summaryCards.map((card) => (
                    <SummaryCard
                        key={card.to}
                        title={card.title}
                        value={card.value ?? 0}
                        icon={card.icon}
                        bgColor={card.bgColor}
                        to={card.to}
                    />
                ))}
            </div>

            {/* GRAFICO AREAS Y ACCIONES RAPIDAS*/}
            <div className={`grid grid-cols-1 gap-6 ${isAdmin ? 'lg:grid-cols-3' : ''}`}>
                <div className={isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    {/* grafico de gestion de areas */}
                    <BarGraphCard title="Productos por Área" footerLinkTo="/area/gestion-areas" loading={dashboardStatsLoading}>
                        {departmentStats.map(dept => (
                            <Bar
                                key={dept.departmentCode}
                                label={<DepartmentNameFormat departmentCode={dept.departmentCode} name={dept.name} />}
                                value={dept.productCount}
                                max={maxDepartmentProducts}
                            />
                        ))}
                    </BarGraphCard>
                </div>

                {/* botones de acciones rapidas generales*/}
                {isAdmin && (
                    <QuickActionsCard
                        actions={quickActions}
                        onFooterClick={() => setIsExpanded(!isExpanded)}
                    />
                )}
            </div>

            {/* TABLA DE PRODUCTOS */}
            <TableCard
                title="ÚLTIMOS PRODUCTOS"
                columns={ProductColumnNames}
                loading={loading}
                data={products}
                footerLinkTo="/producto/gestion-productos"
            />

        </div >
    );
}
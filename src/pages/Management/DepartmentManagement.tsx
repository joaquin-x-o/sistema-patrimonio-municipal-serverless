import { useState } from "react";
import type { ButtonGroupAction } from "../../components/ui/Button/ButtonGroup";
import { ManagementLayout } from "../../components/layout/ManagementLayout";
import { BarGraphCard } from "../../components/ui/Cards/ChartCard";
import { QuickActionsCard } from "../../components/ui/Cards/QuickActionsCard";
import { TableCard } from "../../components/ui/Cards/TableCard";
import { DepartmentNameFormat } from "../../components/features/departments/DepartmentNameFormat";
import { Bar } from "../../components/ui/DataDisplay/BarGraph";
import { ExcelButton } from "../../components/ui/Button/ExcelButton";
import { handleExportExcel } from "../../utils/common/handleExportExcel";
import { DepartmentColumnNames } from "../../components/features/departments/DepartmentColumnNames";
import { useAuth } from "../../hooks/auth/useAuth";
import { UserRole } from "../../types/user.type";
import { useDepartmentProductCountStats } from "../../hooks/query/stats/useDepartmentProductCountStats";
import { useDepartments } from "../../hooks/query/departments/useDepartments";

export default function DepartmentManagement() {
    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    const [currentPage, setCurrentPage] = useState(1);

    const { data: departments, total: departmentsTotal, totalPages: departmentsTotalPages, loading: departmentsLoading } = useDepartments({ page: currentPage, limit: 10 });
    const { data: departmentProductCounts, loading: departmentProductCountsLoading } = useDepartmentProductCountStats(3);

    const actions: ButtonGroupAction[] = [
        { label: "Crear nueva área", to: "/area/crear", variant: "primary" },
        { label: "Editar área", to: "/area/editar", variant: "primary" },
        { label: "Eliminar área", to: "/area/eliminar", variant: "danger" },
    ];

    // estadisticas de gestion por departamento
    const departmentStats = departmentProductCounts;

    const maxDepartmentProducts = Math.max(
        ...departmentStats.map(d => d.productCount),
        0
    );

    return (
        <ManagementLayout
            title="Gestión de Áreas"
            topSection={
                <BarGraphCard title="Áreas con más bienes registrados" loading={departmentProductCountsLoading}>
                    {departmentStats.map(dept => (
                        <Bar
                            key={dept.departmentCode}
                            label={<DepartmentNameFormat departmentCode={dept.departmentCode} name={dept.name} />}
                            value={dept.productCount}
                            max={maxDepartmentProducts}
                        />
                    ))}
                </BarGraphCard>
            }
            sideSection={isAdmin && <QuickActionsCard actions={actions} sidebarKey="productos" />}
            content={
                < TableCard
                    title="Áreas"
                    total={departmentsTotal}
                    columns={DepartmentColumnNames}
                    data={departments}
                    loading={departmentsLoading}
                    pagination={{
                        currentPage,
                        totalPages: departmentsTotalPages,
                        onPageChange: setCurrentPage
                    }}
                />
            }
            floatingAction={< ExcelButton onClick={handleExportExcel} />}
        />
    );
}


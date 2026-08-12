import { useState } from "react";
import type { ButtonGroupAction } from "../../components/ui/Button/ButtonGroup";
import { ManagementLayout } from "../../components/layout/ManagementLayout";
import { QuickActionsCard } from "../../components/ui/Cards/QuickActionsCard";
import { TableCard } from "../../components/ui/Cards/TableCard";
import { ExcelButton } from "../../components/ui/Button/ExcelButton";
import { handleExportExcel } from "../../utils/common/handleExportExcel";
import { UserColumnNames } from "../../components/features/users/userColumnNames";
import { useUsers } from "../../hooks/query/users/useUsers";

export default function UserManagement() {
    const [currentPage, setCurrentPage] = useState(1);

    const { data: users, total, totalPages, loading } = useUsers({ page: currentPage, limit: 10 });


    const quickActions: ButtonGroupAction[] = [
        { label: "Crear nuevo usuario", to: "/usuario/crear", variant: "primary" },
        { label: "Editar usuario", to: "/usuario/editar", variant: "primary" },
        { label: "Eliminar usuario", to: "/usuario/eliminar", variant: "danger" },
    ];

    return (
        <ManagementLayout
            title="Gestión de Usuarios"
            sideSection={<QuickActionsCard actions={quickActions} sidebarKey="usuarios" />}
            content={
                <TableCard
                    title="Usuarios"
                    total={total}
                    columns={UserColumnNames}
                    data={users}
                    loading={loading}
                    pagination={{
                        currentPage,
                        totalPages: totalPages,
                        onPageChange: setCurrentPage
                    }}
                />
            }
            floatingAction={<ExcelButton onClick={handleExportExcel} />}
        />
    );
}
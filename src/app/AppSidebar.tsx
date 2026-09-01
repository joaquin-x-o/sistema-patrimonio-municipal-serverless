import Sidebar from '../components/layout/sidebar/Sidebar';
import { useAuth } from '../hooks/auth/useAuth';
import { navigationConfig } from '../components/layout/sidebar/sidebarNavigationConfig';
import { UserRole } from '../types/user.type';
import { useExportFullInventory } from '../hooks/excel/exportFullInventory';

export default function AppSidebar() {
    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    const { handleExportExcel, isExporting } = useExportFullInventory();

    const LOGO = import.meta.env.VITE_LOGO;
    const GOVERNMENT_NAME = import.meta.env.VITE_GOVERNMENT_NAME;

    return (
        <Sidebar>

            {/* HEADER */}
            <Sidebar.Header logoSrc={LOGO} title='Sistema de Patrimonio' subtitle={GOVERNMENT_NAME} />

            {/* ITEMS */}
            <div className='flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 overflow-x-hidden custom-scrollbar'>
                {navigationConfig.map(menu => {

                    // filtrado de items segun el rol del usuario
                    const allowedItems = menu.items.filter(item =>
                        user?.role && item.roles.includes(user.role)
                    );

                    // si no hay items visibles para este rol, no se muestra el menu entero
                    if (allowedItems.length === 0) return null;

                    return (
                        <Sidebar.Menu
                            key={menu.name}
                            name={menu.name}
                            label={menu.label}
                            icon={menu.icon}
                            items={allowedItems}
                        />
                    );
                })}
            </div>

            {/* EXCEL BUTTON */}
            {isAdmin && (
                <Sidebar.ExcelButton
                    text='Exportar patrimonio'
                    onClick={handleExportExcel}
                    isLoading={isExporting}
                />
            )}

            {/* DANGER */}
            {isAdmin && (
                <Sidebar.DangerButton
                    text='Dar de baja un producto'
                    to='/producto/dar-de-baja'
                />
            )}

            {/* FOOTER */}
            <Sidebar.Footer />

        </Sidebar>
    );
}
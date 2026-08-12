import { UserRole } from '../../../types/user.type';
import { Package, Building2, Users, ClipboardList, type LucideIcon } from 'lucide-react';

type NavItem = {
    label: string;
    to: string;
    danger?: boolean;
    roles: UserRole[];
}

type NavMenu = {
    name: string;
    label: string;
    icon: LucideIcon;
    items: NavItem[];
}

// lista de opciones del sidebar y su respectivo permiso segun el rol de usuario
export const navigationConfig: NavMenu[] = [
    {
        name: 'productos',
        label: 'Productos',
        icon: Package,
        items: [
            { label: 'Crear producto', to: '/producto/crear', roles: [UserRole.ADMIN] },
            { label: 'Editar datos de un producto', to: '/producto/editar', roles: [UserRole.ADMIN] },
            { label: 'Editar estado de un producto', to: '/producto/editar-estado', roles: [UserRole.ADMIN] },
            { label: 'Revisar producto', to: '/producto/revisar', roles: [UserRole.ADMIN] },
            { label: 'Transferir producto', to: '/producto/transferir', roles: [UserRole.ADMIN] },
            { label: 'Ver productos', to: '/producto/gestion-productos', roles: [UserRole.ADMIN, UserRole.VIEWER] },
            { label: 'Eliminar producto', to: '/producto/eliminar', danger: true, roles: [UserRole.ADMIN] },
        ]
    },
    {
        name: 'areas',
        label: 'Áreas',
        icon: Building2,
        items: [
            { label: 'Crear área', to: '/area/crear', roles: [UserRole.ADMIN] },
            { label: 'Editar área', to: '/area/editar', roles: [UserRole.ADMIN] },
            { label: 'Habilitar área', to: '/area/habilitar', roles: [UserRole.ADMIN] },
            { label: 'Deshabilitar área', to: '/area/deshabilitar', roles: [UserRole.ADMIN] },
            { label: 'Ver áreas', to: '/area/gestion-areas', roles: [UserRole.ADMIN, UserRole.VIEWER] },
            { label: 'Eliminar área', to: '/area/eliminar', danger: true, roles: [UserRole.ADMIN] },
        ]
    },
    {
        name: 'reportes',
        label: 'Reportes',
        icon: ClipboardList,
        items: [
            { label: 'Ver reportes', to: '/reportes/gestion-reportes', roles: [UserRole.ADMIN, UserRole.VIEWER] },
        ]
    },
    {
        name: 'usuarios',
        label: 'Usuarios',
        icon: Users,
        items: [
            { label: 'Crear usuario', to: '/usuario/crear', roles: [UserRole.ADMIN] },
            { label: 'Editar usuario', to: '/usuario/editar', roles: [UserRole.ADMIN] },
            { label: 'Habilitar usuario', to: '/usuario/habilitar', roles: [UserRole.ADMIN] },
            { label: 'Deshabilitar usuario', to: '/usuario/deshabilitar', roles: [UserRole.ADMIN] },
            { label: 'Ver usuarios', to: '/usuario/gestion-usuarios', roles: [UserRole.ADMIN] },
            { label: 'Eliminar usuario', to: '/usuario/eliminar', danger: true, roles: [UserRole.ADMIN] },
        ]
    },
];
import { createBrowserRouter } from "react-router-dom";

import { Dashboard, DepartmentManagement, ProductManagement, ReportManagement, ReviewManagement, UserManagement } from "../pages/Management";
import { DepartmentDetails, MaintenanceReport, MovementReport, ProductDetails, RetirementReport, UserDetails } from "../pages/Details";
import { CreateDepartment, DeleteDepartment, DisableDepartment, EditDepartment, EnableDepartment } from "../pages/Actions/departmentActions";
import { CreateProduct, EditProduct, DeleteProduct, TransferProduct, ReviewProduct, EditProductStatus, UnusuableProduct, RepairProduct, RetireProduct } from "../pages/Actions/productActions";
import { CreateUser, EditUser, DeleteUser, EnableUser, DisableUser, ChangePassword } from "../pages/Actions/userActions";

import ErrorPage from "../pages/Error/Error";
import Login from "../pages/Auth/Login";

import PublicLayout from "../components/layout/PublicLayout";
import PrivateLayout from "../components/layout/PrivateLayout";

import { ProtectedRoute } from "../components/features/auth/ProtectedRoute";
import { RoleGuard } from "../components/features/auth/RoleGuard";

import { UserRole } from "../types/user.type";
import LossReport from "../pages/Details/LossReport";
import LostProduct from "../pages/Actions/productActions/LostProduct";
import LogReport from "../pages/Details/LogReport";

export const router = createBrowserRouter([

    // PUBLICO
    {
        element: <PublicLayout />,
        children: [
            { path: "/login", element: <Login /> }
        ]
    },

    // PRIVADO
    {
        element: <ProtectedRoute />, // verificación del inicio de sesion
        errorElement: <ErrorPage type="unknownError" />,
        children: [
            {
                path: "/",
                element: <PrivateLayout />, // acceso de rutas a usuarios ya logeados en el sistema
                errorElement: <ErrorPage type="unknownError" />,
                children: [

                    { index: true, element: <Dashboard /> },

                    /* RUTAS COMPARTIDAS */

                    { path: "area/gestion-areas", element: <DepartmentManagement /> },
                    { path: "area/:departmentCode", element: <DepartmentDetails />, errorElement: <ErrorPage type="resourceNotFoundError" /> },

                    { path: "producto/gestion-productos", element: <ProductManagement /> },
                    { path: "producto/:productCode", element: <ProductDetails />, errorElement: <ErrorPage type="resourceNotFoundError" /> },
                    { path: "producto/pendientes-revision", element: <ReviewManagement /> },

                    { path: "reportes/gestion-reportes", element: <ReportManagement /> },
                    { path: "reportes/perdidas", element: <LossReport /> },
                    { path: "reportes/bajas", element: <RetirementReport /> },
                    { path: "reportes/traslados/:productCode", element: <MovementReport />, errorElement: <ErrorPage type="resourceNotFoundError" /> },
                    { path: "reportes/mantenimiento/:productCode", element: <MaintenanceReport />, errorElement: <ErrorPage type="resourceNotFoundError" /> },

                    // se reutiliza el componete UserDetails para ir a "Mi perfil" (el control de permisos estaría internamente en el componente)
                    { path: "usuario/perfil", element: <UserDetails /> },
                    { path: "usuario/cambiar-clave", element: <ChangePassword /> },


                    /* RUTAS SOLO PARA USUARIOS ADMIN*/
                    {
                        element: <RoleGuard allowedRoles={[UserRole.ADMIN]} />,
                        children: [
                            /* ACCIONES DE AREAS */
                            { path: "area/crear", element: <CreateDepartment /> },
                            { path: "area/editar", element: <EditDepartment /> },
                            { path: "area/eliminar", element: <DeleteDepartment /> },
                            { path: "area/deshabilitar", element: <DisableDepartment /> },
                            { path: "area/habilitar", element: <EnableDepartment /> },

                            /* ACCIONES DE PRODUCTOS */
                            { path: "producto/crear", element: <CreateProduct /> },
                            { path: "producto/editar", element: <EditProduct /> },
                            { path: "producto/eliminar", element: <DeleteProduct /> },
                            { path: "producto/transferir", element: <TransferProduct /> },
                            { path: "producto/revisar", element: <ReviewProduct /> },
                            { path: "producto/editar-estado", element: <EditProductStatus /> },
                            { path: "producto/desuso", element: <UnusuableProduct /> },
                            { path: "producto/reparado", element: <RepairProduct /> },
                            { path: "producto/marcar-perdido", element: <LostProduct /> },
                            { path: "producto/dar-de-baja", element: <RetireProduct /> },

                            /* ACCIONES DE USUARIOS */
                            { path: "usuario/gestion-usuarios", element: <UserManagement /> },
                            { path: "usuario/crear", element: <CreateUser /> },
                            { path: "usuario/editar", element: <EditUser /> },
                            { path: "usuario/eliminar", element: <DeleteUser /> },
                            { path: "usuario/habilitar", element: <EnableUser /> },
                            { path: "usuario/deshabilitar", element: <DisableUser /> },
                            { path: "usuario/:username", element: <UserDetails />, errorElement: <ErrorPage type="resourceNotFoundError" /> },
                            // { path: "usuario/reiniciar-clave", element: <ResetPassword /> },

                            /* AUDITORIA */
                            { path: "reportes/auditoria", element: <LogReport /> },

                        ]
                    }
                ],
            },
        ],
    },
    {
        /* REDIRECCION A INICIO EN CASO DE RUTA DESCONOCIDA*/
        path: "*",
        element: <ErrorPage type="notFoundError" />,
        errorElement: <ErrorPage type="unknownError" />
    }
]);
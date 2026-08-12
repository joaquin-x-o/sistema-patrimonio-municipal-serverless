import { Outlet } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";
import ErrorPage from "../../../pages/Error/Error";

interface Props {
    allowedRoles: string[];
}

export function RoleGuard({ allowedRoles }: Props) {
    const { user } = useAuth();

    // Si no hay usuario o su rol no está en la lista de permitidos, se lanza un error 403
    if (!user?.role || !allowedRoles.includes(user.role)) {
        return <ErrorPage type="forbiddenError" />;
    }

    // Si tiene el rol correcto, se pasa a las rutas hijas
    return <Outlet />;
}
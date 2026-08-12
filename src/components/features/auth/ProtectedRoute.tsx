import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingContainer } from "../../ui/Feedback/LoadingContainer";
import { useAuth } from "../../../hooks/auth/useAuth";

export function ProtectedRoute() {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <LoadingContainer />;

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
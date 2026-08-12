import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { UserRole } from "../../types/user.type";
import { DetailsLayout } from "../../components/layout/DetailsLayout";
import { DetailCard } from "../../components/ui/Cards/DetailCard";
import { InfoField } from "../../components/ui/DataDisplay/InfoField";
import { getStatusRoute } from "../../utils/common/getStatusRoute";
import { UserBadgeStatus, UserRoleBadge } from "../../components/features/users/userBadge";
import ErrorPage from "../../pages/Error/Error";
import { useUser } from "../../hooks/query/users/useUser";
import { LoadingContainer } from "../../components/ui/Feedback/LoadingContainer";

export default function UserDetails() {
    const navigate = useNavigate();
    const { username: usernameParam } = useParams<{ username: string }>();
    const { user, isLoading } = useAuth();

    const username = usernameParam ?? user?.username;

    const { data: userDetails, loading: userLoading, error } = useUser(username);

    const userStatus = userDetails?.isActive;
    const userRole = userDetails?.role;

    if (isLoading || userLoading) return (
        <LoadingContainer />
    );

    const isOwner = user?.username?.toLowerCase() === username?.toLowerCase();
    const isAdmin = user?.role === UserRole.ADMIN;
    const title = isOwner ? "Mi perfil" : "Gestión de usuarios";
    const passwordRoute = isOwner ? "/usuario/cambiar-clave" : "/usuario/reiniciar-clave";

    if (error) throw new Error(error);
    if (!isAdmin && !isOwner) return <ErrorPage type="forbiddenError" />;


    return (
        <DetailsLayout
            title={title}
            sections={[
                // INFORMACION PRINCIPAL
                <DetailCard
                    title={`${userDetails?.name} ${userDetails?.surname}`}
                    centerTitle
                    showEdit={isAdmin}
                    onEdit={() => navigate("/usuario/editar", { state: { username: userDetails?.username } })}
                >
                    <InfoField label="Nombre" value={userDetails?.name} />
                    <InfoField label="Apellido" value={userDetails?.surname} />
                    <InfoField label="Usuario" value={userDetails?.username} />
                </DetailCard>,

                // ESTADO
                <DetailCard
                    label="Estado"
                    value={<UserBadgeStatus status={userStatus ?? false} />}
                    showEdit={isAdmin}
                    onEdit={() => navigate(getStatusRoute(userStatus ?? false, "usuario"), { state: { username: userDetails?.username } })}
                />,

                // CONTRASEÑA
                (isOwner) && (
                    <DetailCard
                        label="Contraseña"
                        value="••••••••"
                        onEdit={() => navigate(passwordRoute, { state: { username: userDetails?.username } })}
                    />
                ),

                // ROL
                <DetailCard
                    label="Rol"
                    value={<UserRoleBadge role={userRole!} />}
                    showEdit={isAdmin}
                    onEdit={() => navigate("/usuario/editar", { state: { username: userDetails?.username } })}
                />,
            ]}
        />
    );
}
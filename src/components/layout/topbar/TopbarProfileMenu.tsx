import { LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Common/Button";
import { useAuth } from "../../../hooks/auth/useAuth";

interface Props {
    onClose: () => void;
    username?: string;
}

export function TopbarProfileMenu({ onClose }: Props) {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleEditProfile = () => {
        onClose();
        // TODO: redirigir a propio perfil
        navigate(`/usuario/perfil`);
    };

    const handleLogout = () => {
        onClose();
        logout();
        navigate("/login");
    };

    return (
        <div className="absolute top-15 right-15 w-56 bg-foreground border border-muted rounded-xl shadow-lg z-50">

            {/* PERFIL*/}
            <div className="flex flex-col items-center justify-center pt-4 pb-3 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full border-2 border-primary bg-transparent flex items-center justify-center mb-2">
                    <UserRound size={24} className="text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground-muted">{user!.username}</span>
            </div>

            {/* ACCIONES */}
            <div className="p-3 flex flex-col gap-1">
                <Button
                    variant="invisible"
                    onClick={handleEditProfile}
                    icon={<UserRound size={16} />}
                    className="w-full justify-start px-3 mb-2 text-sm text-primary hover:bg-muted"
                >
                    Ver mi perfil
                </Button>

                <Button
                    variant="invisible"
                    onClick={handleLogout}
                    icon={<LogOut size={16} />}
                    className="w-full justify-start px-3 text-sm text-danger! hover:bg-red-50! hover:text-danger"
                >
                    Cerrar sesión
                </Button>
            </div>

        </div>
    );
}
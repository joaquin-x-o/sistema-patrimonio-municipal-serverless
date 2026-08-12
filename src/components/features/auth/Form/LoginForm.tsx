import { UserRound, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../../ui/Forms/Form";
import { Input } from "../../../ui/Input/Input";
import { loginSchema, type LoginRequest } from "../../../../schemas/user.schemas";
import { useEffect } from "react";
import { useScrollToRef } from "../../../../hooks/common/useScrollToRef";
import { HelpButton } from "../../../ui/Button/HelpButton";
import { getSubmitText } from "../../../../utils/common/getSubmitText";

interface Props {
    isLoading: boolean;
    serverError: string | null;
    helpText?: string;
    externalValue?: LoginRequest;
    loading: boolean;

    onClear: () => void;
    onSubmit: (data: LoginRequest) => void;
    onHelpClick?: () => void;
}

export function LoginForm({ isLoading, loading, serverError, helpText, externalValue: loginData, onClear, onSubmit, onHelpClick }: Props) {
    const LOGO = import.meta.env.VITE_LOGO;
    const GOVERNMENT_NAME = import.meta.env.VITE_GOVERNMENT_NAME;

    const { ref: errorRef } = useScrollToRef<HTMLDivElement>(!!serverError);


    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {

        if (loginData) {
            setValue("username", loginData.username);
            setValue("password", loginData.password);
        }

    }, [loginData, setValue]);

    const handleClear = () => {
        reset();
        onClear();
    };

    return (
        <div className="w-full max-w-md">
            <Form
                title="Iniciar Sesión"
                onSubmit={handleSubmit(onSubmit)}
                onCancel={handleClear}
                submitText={getSubmitText(loading, "Ingresar")}
                isLoading={isLoading}
                cancelText="Limpiar"
                error={serverError}
                errorRef={errorRef}
            >
                {/* LOGO Y NOMBRE DE LA MUNICIPALIDAD */}
                <div className="flex flex-col items-center justify-center gap-3 mb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                        <img
                            src={LOGO}
                            alt={GOVERNMENT_NAME}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-foreground-muted text-sm sm:text-base font-semibold leading-tight">
                            {GOVERNMENT_NAME}
                        </span>
                        <span className="text-foreground-muted sm:text-base font-semibold leading-tight">
                            (Demo)
                        </span>
                    </div>
                </div>

                {/* LOGIN INPUTS */}
                <Input
                    id="username"
                    label="Nombre de usuario"
                    type="text"
                    placeholder="Ej. usuario123"
                    startIcon={<UserRound size={18} />}
                    disabled={isLoading}
                    {...register("username")}
                    error={errors.username?.message}
                />

                <Input
                    id="password"
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    startIcon={<Lock size={18} />}
                    disabled={isLoading}
                    {...register("password")}
                    error={errors.password?.message}
                />

                {/* se renderiza el boton solo si hay una función de ayuda presente*/}
                {onHelpClick && (
                    <div className="mt-1">
                        <HelpButton onClick={onHelpClick}>
                            {helpText}
                        </HelpButton>
                    </div>
                )}
            </Form>
        </div>
    );
}
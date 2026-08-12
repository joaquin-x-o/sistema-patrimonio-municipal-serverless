import { useRouteError, useNavigate } from "react-router-dom";
import { errorType, type ErrorConfig } from "../../lib/maps/error";
import { Button } from "../../components/ui/Common/Button";
import { Ghost } from "lucide-react";
import { LinkButton } from "../../components/ui/Button/LinkButton";
import { PageTitle } from "../../components/ui/Typography/PageTitle";

interface Props {
    type: keyof typeof errorType;
}

export default function ErrorPage({ type }: Props) {
    const caughtError: any = useRouteError();
    const navigate = useNavigate();
    const currentError: ErrorConfig = errorType[type];

    const dynamicMessage = caughtError?.message || caughtError?.data;
    const finalDescription = dynamicMessage || currentError.description;

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-4">

            {/* TITULO */}
            <PageTitle title={currentError.title} />

            {/* ICONO */}
            <Ghost className="w-20 h-20 text-primary" strokeWidth={1.5} />

            {/* DESCRIPCION */}
            <p className="text-lg text-foreground-muted">
                {finalDescription}
            </p>

            {/* BOTON DE REDIRECCION DINAMICO */}
            {currentError.redirect && (
                currentError.redirect.action === "back" ? (
                    // si la accion es "back", se vuelva al sitio anterior de cuando se disparó el error
                    <Button
                        variant={currentError.variant}
                        onClick={() => navigate(-1)}
                        className="text-sm"
                    >
                        {currentError.redirect.text}
                    </Button>
                ) : (
                    // si no hay accion "back", el boton redirigira al inicio de la pagina
                    <LinkButton
                        variant={currentError.variant}
                        to={currentError.redirect.linkTo!}
                        className="text-sm"
                    >
                        {currentError.redirect.text}
                    </LinkButton>
                )
            )}
        </div>
    );
}
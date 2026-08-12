import { Check } from "lucide-react";
import { Button } from "../Common/Button";
import { FooterLink } from "../Button/FooterLink";
import { ResultTitle } from "../Typography/ResultTitle";

interface Props {
    title: string;
    description?: string;

    onFinish: () => void;

    footerLinkText?: string;
    footerLinkTo?: string;
    buttonText?: string;
}

export function SuccessfulCard({
    title,
    description,
    buttonText = 'Ir a inicio',
    onFinish,
    footerLinkText = '',
    footerLinkTo = '/'
}: Props) {
    return (
        <div className="bg-foreground border rounded-xl border-slate-200 w-full max-w-xl mx-auto py-12 px-6 flex flex-col items-center justify-center">

            {/* icono de exito */}
            <div className="bg-primary-hover rounded-full w-24 h-24 flex items-center justify-center mb-6">
                <Check className="text-foreground w-14 h-14" strokeWidth={4} />
            </div>

            {/* contenido (titulo, descripcion y footerlink) */}
            <div className="flex flex-col items-center gap-3 mb-10 text-center">

                <ResultTitle>
                    {title}
                </ResultTitle>

                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}

                {footerLinkText && (
                    <FooterLink
                        label={footerLinkText}
                        to={footerLinkTo}
                    />
                )}
            </div>

            {/* 3. Botón Fijo */}
            <Button variant="primary" onClick={onFinish} className="px-10 py-2">
                {buttonText}
            </Button>

        </div >
    );
}
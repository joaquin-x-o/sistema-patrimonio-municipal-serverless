import { useState } from "react";
import { Check, X } from "lucide-react";
import { Modal } from "../Common/Modal";
import { Button } from "../Common/Button";
import type { ButtonVariant } from "../Button/buttonStyles";

interface Props {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    confirmVariant?: ButtonVariant;
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
    successMessage?: string;
}

type ModalStep = "CONFIRM" | "SUCCESS" | "ERROR";

// modal para confirmar acciones importantes
export function ConfirmActionModal({
    isOpen,
    title,
    description,
    confirmText = "Confirmar",
    confirmVariant = "primary",
    onConfirm,
    onClose,
    successMessage = "Acción realizada con éxito"
}: Props) {

    const [step, setStep] = useState<ModalStep>("CONFIRM");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // función para manejar la confirmación de acciones que requieren modal
    const handleConfirm = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            await onConfirm();
            setStep("SUCCESS");
        } catch (error: any) {
            setErrorMessage(error.message ?? "Ocurrió un error.");
            setStep("ERROR");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        setStep("CONFIRM");
        setErrorMessage(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={title} maxWidth="sm">

            {/* PASO 1: CONFIRMACION */}
            {step === "CONFIRM" && (
                <div className="flex flex-col gap-6">
                    <p className="text-sm text-center text-foreground-muted">{description}</p>
                    <div className="flex justify-center gap-4 pt-2 border-muted">
                        <Button variant="neutral" className="text-sm" onClick={handleClose} disabled={loading}>Cancelar</Button>
                        <Button variant={confirmVariant} className="text-sm" onClick={handleConfirm} disabled={loading}>
                            {loading ? "Procesando..." : confirmText}
                        </Button>
                    </div>
                </div>
            )}

            {/* PASO 2: MENSAJE DE EXITO */}
            {step === "SUCCESS" && (
                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="bg-primary-hover rounded-full w-16 h-16 flex items-center justify-center">
                        <Check className="text-foreground w-10 h-10" strokeWidth={4} />
                    </div>
                    <p className="text-sm text-center text-foreground-muted font-medium">{successMessage}</p>
                    <Button variant="primary" onClick={handleClose} className="text-sm">Cerrar</Button>
                </div>
            )}

            {/* PASO 3: MENSAJE DE ERROR */}
            {
                step === "ERROR" && (
                    <div className="flex flex-col items-center gap-6 py-4">
                        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center">
                            <X className="text-danger w-10 h-10" strokeWidth={4} />
                        </div>
                        <p className="text-sm text-center font-medium text-foreground-muted">{errorMessage}</p>
                        <div className="flex gap-4">
                            <Button variant="neutral" className="text-sm" onClick={handleClose}>Cerrar</Button>
                            <Button variant={confirmVariant} className="text-sm" onClick={() => setStep("CONFIRM")}>Reintentar</Button>
                        </div>
                    </div>
                )
            }

        </Modal >
    );
}
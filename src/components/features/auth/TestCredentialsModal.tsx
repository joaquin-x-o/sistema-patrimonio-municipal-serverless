import { Modal } from "../../ui/Common/Modal";

interface TestCredentialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (username: string, password: string) => void;
}

// credenciales de prueba para acceder como admin o viewer al sistema
export function TestCredentialsModal({ isOpen, onClose, onSelect }: TestCredentialsModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Credenciales de prueba">
            <div className="flex flex-col gap-4 text-sm text-foreground-muted">
                <p>Selecciona una de las opciones para autocompletar el formulario:</p>
                <div className="space-y-3">
                    <button
                        onClick={() => onSelect("adminpatrimonio", "sistemapatrimonio")}
                        className="w-full text-left p-3 bg-background hover:bg-primary/10 rounded-lg border border-slate-200 transition-colors group cursor-pointer"
                    >
                        <p className="font-bold text-primary mb-1 text-xs uppercase tracking-wider group-hover:text-primary-dark">
                            Rol: Administrador
                        </p>
                        <p><span className="font-semibold">Usuario:</span> adminpatrimonio</p>
                        <p><span className="font-semibold">Contraseña:</span> sistemapatrimonio</p>
                    </button>

                    <button
                        onClick={() => onSelect("lectorpatrimonio", "sistemapatrimonio")}
                        className="w-full text-left p-3 bg-background hover:bg-primary/10 rounded-lg border border-slate-200 transition-colors group cursor-pointer"
                    >
                        <p className="font-bold text-primary mb-1 text-xs uppercase tracking-wider group-hover:text-primary-dark">
                            Rol: Viewer
                        </p>
                        <p><span className="font-semibold">Usuario:</span> lectorpatrimonio</p>
                        <p><span className="font-semibold">Contraseña:</span> sistemapatrimonio</p>
                    </button>

                    <p className="text-sm font-light italic border-t text-primary mt-2 pt-1">
                        * El usuario administrador tiene acceso total, mientras que el viewer solo puede visualizar los bienes y gestionar su propio perfil.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
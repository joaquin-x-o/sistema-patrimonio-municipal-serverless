import { FileDown } from "lucide-react";
import { Button } from "../../ui/Common/Button";
import { Modal } from "../../ui/Common/Modal";

// modal sobre las indicaciones para realizar la constatación física de los productos listados
export function CheckGuidelinesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Constatación" maxWidth="lg">
            <div className="flex flex-col gap-4 text-foreground-muted">
                <p>
                    Estás por ver la lista de productos que requieren de una <strong>constatación física</strong>;
                    es decir, aquellos que deben verificarse para confirmar que están presentes en el lugar correspondiente.
                </p>
                <div className="bg-surface-muted p-4 rounded-lg border border-muted flex flex-col gap-3">
                    <p className="text-sm">
                        <strong>Sugerencia de trabajo:</strong>
                        <p className="py-1">Podés exportar esta planilla para realizar el relevamiento físico cómodamente.</p>
                    </p>
                    <Button className="w-full flex justify-center gap-2 text-sm" variant="outlinePrimary">
                        <FileDown size={18} />
                        Exportar Planilla
                    </Button>
                </div>
                <p>
                    Una vez finalizado el procedimiento, volvé al sistema para validar la existencia de cada producto.
                </p>
                <Button onClick={onClose} className="mt-2 w-full text-sm">
                    Entendido
                </Button>
            </div>
        </Modal>
    );
}
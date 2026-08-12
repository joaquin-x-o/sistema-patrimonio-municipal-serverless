import { useProductActions, type ProductActionKey } from "../../../hooks/query/products/actions/useProductStatusUpdate";
import { ConfirmActionModal } from "../../ui/Modals/ConfirmActionModal";
import type { StatusOption } from "./status/ProductStatusConfig";


interface Props {
    productCode: string;
    action: StatusOption | null;
    onClose: () => void;
    onSuccess?: () => void;
}

// maneja las acciones que requieren confirmación mediante modal, como marcar un producto como extraviado o aprobar su revision
export function ProductActionModal({ productCode, action, onClose, onSuccess }: Props) {
    const { changeStatus } = useProductActions();

    const handleConfirm = async () => {
        if (!action?.actionKey) return;
        await changeStatus(action.actionKey as ProductActionKey, productCode);
    };

    const handleClose = () => {
        if (onSuccess) onSuccess();
        onClose();
    };

    return (
        <ConfirmActionModal
            isOpen={!!action}
            title={action?.label ?? ""}
            description={action?.modalDescription ?? "¿Confirmás esta acción?"}
            onConfirm={handleConfirm}
            onClose={handleClose}
        />
    );
}
import { useState } from "react";
import { LinkButton } from "../../../ui/Button/LinkButton";
import { Button } from "../../../ui/Common/Button";
import { statusOptionsConfig, type StatusOption } from "./ProductStatusConfig";
import type { ProductFilterTab, ProductStatus } from "../../../../types/product.type";
import { ProductActionModal } from "../ProductActionModal";

interface Props {
    productCode: string;
    productStatus: ProductStatus | ProductFilterTab;
    onActionSuccess?: () => void;
}

export function ProductStatusOptions({ productCode, productStatus, onActionSuccess }: Props) {

    const [selectedAction, setSelectedAction] = useState<StatusOption | null>(null);

    const options = statusOptionsConfig[productStatus] ?? [];

    return (
        <>
            <div className="flex flex-wrap gap-3">
                {options.length > 0 ? (
                    options.map((option, index) => (
                        // si la opción tiene 'to', es un link al formulario de edicion de estado. si no, es un boton que lleva a la confirmacion del cambio de estado.
                        option.to ? (
                            <LinkButton
                                key={index}
                                variant={option.variant || "primary"}
                                className="text-sm"
                                to={option.to}
                                state={{ productCode }}
                            >
                                {option.label}
                            </LinkButton>
                        ) : (
                            <Button
                                key={index}
                                variant={option.variant || "primary"}
                                className="text-sm"
                                onClick={() => setSelectedAction(option)}
                            >
                                {option.label}
                            </Button>
                        )
                    ))
                ) : (
                    <span className="text-sm text-foreground-muted">No hay acciones disponibles</span>
                )}
            </div>

            <ProductActionModal
                productCode={productCode}
                action={selectedAction}
                onClose={() => setSelectedAction(null)}
                onSuccess={onActionSuccess}
            />
        </>
    );
}
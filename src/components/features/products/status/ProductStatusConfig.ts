import { ProductStatus, type ProductFilterTab } from "../../../../types/product.type";


export type StatusOption = {
    label: string;
    to?: string;
    isModal?: boolean;
    modalDescription?: string;
    actionKey?: string;
    variant?: "danger" | "warning" | "primary" | "success" | "neutral" | "invisible" | "outlinePrimary";
};

// cada estado de producto tiene un conjunto de opciones de acciones disponibles para realizar dentro del sistema
export const statusOptionsConfig: Record<ProductFilterTab, StatusOption[]> = {
    [ProductStatus.ACTIVE]: [
        { label: "Marcar en revisión", to: `/producto/revisar` },
        { label: "Marcar en desuso", to: `/producto/desuso` },
        { label: "Marcar como extraviado", to: `/producto/marcar-perdido` },
        { label: "Dar de baja", to: `/producto/dar-de-baja`, variant: "danger" }
    ],

    [ProductStatus.IN_REVIEW]: [
        {
            label: "Aprobar revisión",
            isModal: true,
            actionKey: "approveReview",
            modalDescription: "¿Confirma aprobar la revisión de este producto?",
            variant: 'outlinePrimary'
        },
        { label: "Marcar en desuso", to: `/producto/desuso`, variant: 'outlinePrimary' },
        { label: "Marcar como extraviado", to: `/producto/marcar-perdido` },
        { label: "Dar de baja", to: `/producto/dar-de-baja`, variant: "danger" }
    ],

    [ProductStatus.UNUSABLE]: [
        { label: "Marcar como reparado", to: `/producto/reparado`, variant: 'outlinePrimary' },
        { label: "Dar de baja", to: `/producto/dar-de-baja`, variant: "danger" }
    ],

    [ProductStatus.LOST]: [
        {
            label: "Marcar como encontrado",
            isModal: true,
            actionKey: "markFound",
            modalDescription: "¿Confirma marcar este producto como encontrado?",
            variant: 'outlinePrimary'
        },
        { label: "Dar de baja", to: `/producto/dar-de-baja`, variant: "danger" }
    ],

    [ProductStatus.RETIRED]: [
        {
            label: "Habilitar",
            isModal: true,
            actionKey: "enableProduct",
            modalDescription: "¿Confirma habilitar este producto?",
            variant: 'outlinePrimary'
        },
    ],

    ['CHECK_REVIEW']: [
        {
            label: "Confirmar existencia",
            isModal: true,
            actionKey: "checkExistence",
            modalDescription: "¿Confirma verificar la existencia física de este producto?",
            variant: 'outlinePrimary'
        },
        { label: "Marcar como extraviado", to: `/producto/marcar-perdido` },

    ]
};
import type { ButtonVariant } from "../../components/ui/Button/buttonStyles";

export interface ErrorConfig {
    title: string;
    description: string;
    variant: ButtonVariant;
    redirect?: {
        linkTo?: string;
        text?: string;
        action?: "back";
    }
}


export const errorType = {
    unknownError: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido en la app o en el servidor. Por favor, inténtalo de nuevo más tarde.",
        variant: "primary",
        redirect: {
            linkTo: "/",
            text: "Volver al inicio"
        }
    },
    notFoundError: {
        title: "Error 404",
        description: "La ruta no existe o no se encuentra disponible.",
        variant: "primary",
        redirect: {
            linkTo: "/",
            text: "Volver al inicio"
        }
    },
    forbiddenError: {
        title: "Acceso denegado",
        description: "No tenés permisos para ver esta página.",
        variant: "primary",
        redirect: {
            linkTo: "/",
            text: "Volver al inicio"
        }
    },
    resourceNotFoundError: {
        title: "Elemento no encontrado",
        description: "El registro que estás buscando no existe",
        variant: "primary",
        redirect: {
            action: "back",
            text: "Volver atrás"
        }
    }
} as const satisfies Record<string, ErrorConfig>;
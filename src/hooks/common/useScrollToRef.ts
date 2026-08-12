// manejar el scroll a un elemento referenciado
import { useEffect, useRef, useState } from "react";

export function useScrollToRef<T extends HTMLElement>(trigger?: unknown) {
    const ref = useRef<T | null>(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    // OPCION CON TRIGGER: cuando el trigger cambia, se activa el scroll
    // usado cuando se quiere activar el scroll desde un cambio de estado o efecto
    useEffect(() => {
        if (trigger) setShouldScroll(true);
    }, [trigger]);

    // OPCION "MANUAL": se expone una función para activar el scroll desde el componente
    // usado cuando se quiere activar el scroll desde un evento específico (ej: al aplicar filtros)
    useEffect(() => {
        if (shouldScroll) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    return { ref, scrollToRef: () => setShouldScroll(true) };
}

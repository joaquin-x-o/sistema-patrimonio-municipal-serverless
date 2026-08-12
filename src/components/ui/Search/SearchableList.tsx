import { useState } from "react";
import { Input } from "../Input/Input";
import { SearchResultsList } from "./SearchResultsList";

type Props<T> = {
    items: T[]; // lista de datos por mostrar
    getKey: (item: T) => string | number; // key para acceder a un dato de la lista
    getSearchText: (item: T) => string; // busqueda del usuario
    onSelect: (item: T) => void; // funcion que se ejecuta cuando el usuario selecciona un dato de la lista
    children: (item: T) => React.ReactNode; // forma en la que se renderizara la lista de datos 
    placeholder?: string; // placeholder del input
    emptyMessage?: string; // mensaje que se mostrara en caso de no encontrar el dato buscado
};

// el componente es generico por lo que puede recibir cualquier tipo de datos, dependiendo el uso especifico en ese momento
export function SearchableList<T>({
    items,
    getKey,
    getSearchText,
    onSelect,
    children,
    placeholder = "Buscar...",
    emptyMessage = "No se encontraron resultados",
}: Props<T>) {

    // estado de la busqueda
    const [query, setQuery] = useState("");

    // numero maximo de datos permitidos en la lista (para mejorar performance)
    const MAX_VISIBLE = 10;

    // normalizacion de la busqueda 
    const normalize = (input: string) =>
        input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // busqueda general
    const filtered = items.filter((item) =>
        normalize(getSearchText(item)).includes(query.toLowerCase())
    );

    // limitacion de lo que se va a renderizar
    const visibleItems =
        query === "" ? filtered.slice(0, MAX_VISIBLE) : filtered;

    return (
        <div className="flex flex-col gap-4">

            {/* input */}
            <Input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {/* lista de resultados */}
            <SearchResultsList
                items={visibleItems}
                getKey={getKey}
                onSelect={onSelect}
                emptyMessage={emptyMessage}
                className="mt-2 border border-muted rounded-md"
            >
                {/* formato de los elementos de la lista */}
                {children}
            </SearchResultsList>
        </div>
    );
}
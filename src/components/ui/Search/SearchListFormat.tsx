interface Props {
    name: string,
    code?: string | number
}

// formato de cada resultado que se muestra en la barra de busqueda
export function SearchListFormat({ name, code }: Props) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-foreground-muted">
                {name}
            </span>

            {code !== undefined && <span className="text-sm text-foreground font-bold bg-primary-hover px-2 py-1 rounded">
                COD. {code}
            </span>}

        </div>
    );
}
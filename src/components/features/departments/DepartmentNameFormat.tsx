interface Props {
    departmentCode: string,
    name: string
}

export function DepartmentNameFormat({ departmentCode, name }: Props) {
    return (
        <div className="flex flex-col items-center" >
            <span className="text-foreground-muted" > {departmentCode} </span>
            < span className="text-[10px] text-foreground-muted opacity-80 uppercase tracking-wider" >
                {name}
            </span>
        </div>
    )
}
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { SelectFilter } from "../Filters/SelectFilter";

interface Props<TFormValues extends FieldValues, TOptionValue extends string> {
    name: Path<TFormValues>;
    control: Control<TFormValues>;
    options: Array<{ value: TOptionValue; label: string }>;
    error?: string;
}

// input para seleccionar una lista de opciones predefinidas
export function SelectInput<TFormValues extends FieldValues, TOptionValue extends string>({
    name,
    control,
    options,
    error
}: Props<TFormValues, TOptionValue>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="flex flex-col gap-1 w-full">
                    <SelectFilter<TOptionValue>
                        label=""
                        value={field.value as TOptionValue}
                        options={options}
                        onChange={field.onChange}
                    />
                    {error && (
                        <span className="text-xs text-danger">
                            {error}
                        </span>
                    )}
                </div>
            )}
        />
    );
}
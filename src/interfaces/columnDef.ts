import type { ReactNode } from "react";

export interface ColumnDef<T> {
    header: string;
    accessorKey: keyof T;
    cell?: (row: T) => ReactNode;
}
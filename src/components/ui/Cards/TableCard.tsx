import type { ColumnDef } from "../../../interfaces/columnDef";
import { Card } from "../Common/Card";
import { LoadingDots } from "../DataDisplay/LoadingDots";
import { Table } from "../DataDisplay/Table";
import Pagination from "../Navigation/Pagination";

interface TableCardProps<T> {
    title: string;
    total?: number;
    columns: ColumnDef<T>[];
    data: T[];
    loading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    filters?: React.ReactNode;
    footerLinkTo?: string;
    tableRef?: React.RefObject<HTMLDivElement | null>;
}

// card que contiene una tabla, con opcion de paginacion y filtros
export function TableCard<T>({
    title,
    total,
    columns,
    data,
    loading,
    pagination,
    filters,
    footerLinkTo,
    tableRef
}: TableCardProps<T>) {
    return (
        <Card title={title} total={total} footerLinkTo={footerLinkTo}>
            {filters && <div className="mb-4">{filters}</div>}
            <div ref={tableRef}>
                {loading && <LoadingDots />}

                {!loading && data.length === 0 && (
                    <div className="flex justify-center items-center py-10 text-lg text-foreground-muted">
                        No hay datos para mostrar.
                    </div>
                )}

                {!loading && data.length > 0 && (
                    <Table columns={columns} data={data} />
                )}
            </div>

            {pagination && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.onPageChange}
                />
            )}
        </Card>
    );
}
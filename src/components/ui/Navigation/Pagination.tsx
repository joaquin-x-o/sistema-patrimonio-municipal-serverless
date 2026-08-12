import { Button } from "../Common/Button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            {/* BOTON PAGINA ANTERIOR */}
            <Button
                variant="neutral"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 px-0! py-0! text-xs!"
            >
                {"<"}
            </Button>

            {/* INDICADOR PAGINA ACTUAL */}
            <span className="bg-muted px-4 py-1 rounded text-primary font-bold text-sm shadow-sm border border-slate-200">
                {currentPage}
            </span>

            {/* BOTON PAGINA SIGUIENTE */}
            <Button
                variant="neutral"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 px-0! py-0! text-xs!"
            >
                {">"}
            </Button>
        </div>
    );
}
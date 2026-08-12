export interface FilterProps {
    searchParams: URLSearchParams;
    setSearchParams: (params: URLSearchParams) => void;
    setCurrentPage: (page: number) => void;
    onApply?: () => void;
}
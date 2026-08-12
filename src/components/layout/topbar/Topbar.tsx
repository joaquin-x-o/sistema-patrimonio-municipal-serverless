import { Menu, Search, UserRound } from "lucide-react";
import { useSidebar } from "../sidebar/SidebarProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../ui/Input/Input";
import { SearchResultsList } from "../../ui/Search/SearchResultsList";
import { SearchListFormat } from "../../ui/Search/SearchListFormat";
import { TopbarProfileMenu } from "./TopbarProfileMenu";
import type { ProductLightResponse } from "../../../schemas/product.schemas";
import { useProductSearch } from "../../../hooks/query/products/useProductSearch";

export default function Topbar() {

    const navigate = useNavigate();

    const { setIsExpanded } = useSidebar();

    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const { results: searchResults } = useProductSearch(search);


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = search.trim();
        if (code) {
            navigate(`/producto/${code}`);
            setSearch("");
            setIsFocused(false);
        }
    };

    const handleSelectProduct = (productCode: number) => {
        navigate(`/producto/${productCode}`);
        setSearch("");
        setIsFocused(false);
    };

    return (
        <header className="h-22 bg-foreground border-b border-muted flex items-center justify-between px-4 md:px-8 gap-4 shrink-0">

            <div className="w-10 shrink-0 flex items-center">
                {/* MOVIL */}
                <button
                    onClick={() => setIsExpanded(true)}
                    className="md:hidden p-2 text-primary rounded-md"
                >
                    <Menu size={24} />
                </button>

                {/* DESKTOP */}
                <div className="hidden md:block w-full h-full"></div>
            </div>

            {/* barra de busqueda */}
            <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-56 sm:max-w-md md:max-w-2xl">
                    <form onSubmit={handleSearchSubmit} className="w-full max-w-56 sm:max-w-md md:max-w-2xl">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar producto..."
                            startIcon={<Search size={18} />} // Le pasamos la lupa directo acá
                            className="rounded-full!"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        />
                    </form>

                    {/* ventana flotante que encuentra los resultados del usuario*/}
                    {isFocused && search.trim().length > 0 && (
                        <SearchResultsList
                            items={searchResults}
                            getKey={(p) => p.productCode}
                            onSelect={(p) => handleSelectProduct(p.productCode)}
                            emptyMessage={`No se encontraron productos para "${search}"`}
                            className="absolute top-full left-0 right-0 mt-2 bg-foreground border border-slate-200 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                            {(product: ProductLightResponse) => <SearchListFormat name={product.name} code={product.productCode} />}
                        </SearchResultsList>
                    )}
                </div>

            </div>

            {/* icono de usuario */}
            <div className="w-10 flex justify-end shrink-0">
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 100)}
                    className="group w-10 h-10 rounded-full border-2 border-primary bg-transparent flex items-center justify-center hover:bg-primary cursor-pointer transition-all duration-100" >
                    <UserRound
                        size={20}
                        className="text-primary group-hover:text-foreground transition-colors duration-100"
                    />
                </button>

                {isUserMenuOpen && (
                    <TopbarProfileMenu onClose={() => setIsUserMenuOpen(false)} />
                )}
            </div>

        </header>
    );
}
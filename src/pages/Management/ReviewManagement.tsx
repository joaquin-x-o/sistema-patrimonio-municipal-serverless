import { useSearchParams } from "react-router-dom";
import { ProductStatus, type ProductFilterTab } from "../../types/product.type";
import { useEffect, useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { CheckGuidelinesModal } from "../../components/features/products/CheckGuidelinesModal";
import type { ReviewDisplayProduct } from "../../interfaces/responses/productResponses";
import { mapReviewProducts } from "../../lib/maps/productReviewDaysLabel";
import type { TabOption } from "../../interfaces/TapOption";
import { FilterTabs } from "../../components/ui/Filters/FilterTabs";
import { ReviewCard } from "../../components/ui/Cards/ReviewCard";
import { PageTitle } from "../../components/ui/Typography/PageTitle";
import { useReviewProducts } from "../../hooks/query/products/useReviewProducts";

export default function ReviewManagement() {

    const [searchParams, setSearchParams] = useSearchParams();

    const urlTab = searchParams.get("tab") as ProductFilterTab;

    // por defecto, al abrir esta seccion, se mostrara la pestaña de productos en revisión
    const initialTab = (urlTab === 'CHECK_REVIEW' || Object.values(ProductStatus).includes(urlTab as ProductStatus)) ? urlTab : ProductStatus.IN_REVIEW;

    // estado que controla la pestaña activa 
    const [activeTab, setActiveTab] = useState<ProductFilterTab>(initialTab);

    const [ischeckGuidelinesModalOpen, setIsCheckGuidelinesModalOpen] = useState(false);

    // estado para guardar los productos que se eligen a partir de la pestaña
    const [reviewProducts, setReviewProducts] = useState<ReviewDisplayProduct[]>([]);

    const { products, counts, loading, refetch } = useReviewProducts(activeTab);

    // configuración de las pestañas
    const reviewTabs: TabOption[] = [
        { id: ProductStatus.LOST, label: "Extraviados", count: counts?.[ProductStatus.LOST] ?? 0, dotColor: "bg-primary-hover" },
        { id: ProductStatus.IN_REVIEW, label: "En revisión", count: counts?.[ProductStatus.IN_REVIEW] ?? 0, dotColor: "bg-primary-hover" },
        { id: ProductStatus.UNUSABLE, label: "En desuso", count: counts?.[ProductStatus.UNUSABLE] ?? 0, dotColor: "bg-primary-hover" },
        { id: 'CHECK_REVIEW', label: "Por constatar", count: counts?.CHECK_REVIEW ?? 0, dotColor: "bg-primary-hover" },
    ];

    // cambiar el parametro de la url
    const handleTabChange = (tabId: ProductFilterTab) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    // controla si al abrir la sección, se muestra el modal de instrucciones para la constatación física al ingresar desde otra pagina
    useEffect(() => {
        if (searchParams.get("checkGuidelines") === "true") {
            setIsCheckGuidelinesModalOpen(true);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("checkGuidelines");
            setSearchParams(newParams, { replace: true });
        }
    }, []);

    // cada vez que se cambia de pestaña, se actualizan los productos que se muestran
    useEffect(() => {
        if (!loading) {
            setReviewProducts(mapReviewProducts(products, activeTab));
        }
    }, [products, loading, activeTab]);

    return (
        <div className="flex flex-col gap-6 relative pb-20">
            <PageTitle title={"Productos en revisión"} />

            {/* TABS DE REVISION*/}
            <FilterTabs
                tabs={reviewTabs}
                activeTab={activeTab}
                onChange={(tabId) => handleTabChange(tabId as ProductFilterTab)}
            />

            {/* PRODUCTOS EN REVISION DE LA TAB ACTIVA */}
            <div className="flex flex-col gap-4 mt-4">
                {reviewProducts.length > 0 ? (
                    reviewProducts.map((product) => (
                        <ReviewCard key={product.productCode} product={product} currentTab={activeTab} onSuccess={refetch} />
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500 bg-foreground rounded-md border border-slate-200">
                        <p>No hay productos en esta categoría por el momento.</p>
                    </div>
                )}
            </div>

            {activeTab === 'CHECK_REVIEW' && (
                <button
                    onClick={() => setIsCheckGuidelinesModalOpen(true)}
                    title="Ver instrucciones y exportar"
                    className="fixed bottom-6 right-8 bg-primary-hover text-foreground p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 z-50 flex items-center justify-center cursor-pointer border-none animate-in slide-in-from-bottom-10 duration-300"
                >
                    <FileSpreadsheet size={25} strokeWidth={1.5} />
                </button>
            )}

            <CheckGuidelinesModal
                isOpen={ischeckGuidelinesModalOpen}
                onClose={() => setIsCheckGuidelinesModalOpen(false)}
            />
        </div>
    );
}
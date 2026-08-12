import { ProductStatus, type ProductFilterTab } from "../../../types/product.type";
import { useAuth } from "../../../hooks/auth/useAuth";
import { UserRole } from "../../../types/user.type";
import { formatDateAR } from "../../../utils/date/formattedDate";
import type { ReviewDisplayProduct } from "../../../interfaces/responses/productResponses";
import { ProductStatusOptions } from "../../features/products/status/ProductStatusOptions";
import { getDayDifference } from "../../../utils/date/getDaydifference";

interface Props {
    product: ReviewDisplayProduct
    currentTab: ProductFilterTab
    onSuccess: () => void
}


export function ReviewCard({ product, currentTab, onSuccess }: Props) {

    const { user } = useAuth();

    // si se analizan productos por constatar, se realiza una comparación con respecto a su lastCheckDate
    const daysPending = currentTab === 'CHECK_REVIEW' ? (product.lastCheckDate ? getDayDifference(product.lastCheckDate) : Infinity) : product.reviewDaysPending;

    const containerBorder = daysPending > 7 ? "border-warning border-2" : "border-slate-200";

    // formateo a fecha local
    const formattedStatusDate = formatDateAR(product.statusUpdatedAt);
    const formattedCheckDate = formatDateAR(product.lastCheckDate);


    const reviewReasonConfig: Partial<Record<ProductFilterTab, string>> = {
        [ProductStatus.IN_REVIEW]: product.pendingReviewReason || "Sin motivo especificado",
        [ProductStatus.LOST]: `Pérdida registrada en el sistema el ${formattedStatusDate}`,
        [ProductStatus.UNUSABLE]: product.unusableReason || "Sin detalle de rotura",
        ['CHECK_REVIEW']: product.lastCheckDate ? `No se revisó su existencia desde el ${formattedCheckDate}` : "Nunca se revisó su existencia",
    };

    const currentActionKey = currentTab === 'CHECK_REVIEW' ? 'CHECK_REVIEW' : product.status;

    const reviewReason = reviewReasonConfig[currentActionKey] ?? "Sin motivo";

    return (
        <div className={`bg-foreground rounded-md border ${containerBorder} shadow-sm overflow-hidden flex flex-col`}>

            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
                <span className="text-foreground-muted">
                    <span className="font-bold">Producto:</span> {product.name}
                </span>
                <span className="text-slate-800">
                    <span className="font-bold">COD.</span> {product.productCode}
                </span>
            </div>

            {/* CONTENT */}
            <div className="flex flex-col gap-3 px-6 py-5">
                <p className="text-foreground-muted">
                    <span className="font-bold">Motivo de revisión:</span> {reviewReason}
                </p>
                <p className="text-foreground-muted">
                    <span className="font-bold">Ubicación actual:</span> {`${product.department.name} (${product.department.departmentCode})`}
                </p>
                <p className="text-foreground-muted">
                    <span className="font-bold">{currentTab === 'CHECK_REVIEW' ? 'Sin constatar hace:' : 'Pendiente hace:'}</span> {product.daysPendingLabel}
                </p>
            </div>

            {/* ACCIONES*/}
            {user?.role === UserRole.ADMIN && (
                <div className="flex flex-wrap items-center justify-end gap-3 px-6 pb-5">
                    <ProductStatusOptions
                        productCode={product.productCode.toString()}
                        productStatus={currentActionKey}
                        onActionSuccess={onSuccess}
                    />
                </div>
            )};
        </div>
    );
}
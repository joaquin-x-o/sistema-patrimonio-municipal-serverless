import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { UserRole } from "../../types/user.type";
import { ProductCategory, ProductCondition, ProductStatus } from "../../types/product.type";
import { useState } from "react";
import { DetailsLayout } from "../../components/layout/DetailsLayout";
import { AlertTriangle } from "lucide-react";
import { formatCalendarDateAR, formatDateAR } from "../../utils/date/formattedDate";
import { ProductBadgeStatus } from "../../components/features/products/status/ProductBadgeStatus";
import { FooterLink } from "../../components/ui/Button/FooterLink";
import { categoryTranslations, conditionTranslations } from "../../utils/dictionaries/productDictionaries";
import { ProductStatusOptions } from "../../components/features/products/status/ProductStatusOptions";
import { DetailCard } from "../../components/ui/Cards/DetailCard";
import { InfoField } from "../../components/ui/DataDisplay/InfoField";
import { Card } from "../../components/ui/Common/Card";
import { LoadingContainer } from "../../components/ui/Feedback/LoadingContainer";
import { useProduct } from "../../hooks/query/products/useProduct";
import { useProductHistoryMeta } from "../../hooks/query/products/useCheckProductHistory";
import { formatPrice } from "../../utils/common/priceFormatters";
import { formatAreaCode } from "../../utils/common/formatAreaCode";

const reportLinks = (productCode: string) => [
    { key: "maintenance", label: "Reportes de mantenimiento", to: `/reportes/mantenimiento/${productCode}` },
    { key: "movements", label: "Reportes de traslados", to: `/reportes/traslados/${productCode}` },
];

export default function ProductDetails() {
    const { productCode } = useParams<{ productCode: string }>();

    const navigate = useNavigate();

    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    const [showStatusOptions, setShowStatusOptions] = useState(false);

    const { data: productDetails, loading, error, refetch } = useProduct(productCode);
    const { hasMaintenance, hasMovements } = useProductHistoryMeta(productCode);

    if (loading) return (
        <LoadingContainer />
    );

    if (error) throw new Error(error);


    const productStatus = productDetails?.status ?? ProductStatus.ACTIVE;
    const productCategory = productDetails?.category;
    const productCondition = productDetails?.physicalCondition;
    const needsCheckReview = productDetails?.needsCheckReview;

    let productReason = "";

    if (productStatus === ProductStatus.IN_REVIEW) {
        productReason = productDetails?.pendingReviewReason ?? "Motivo de revisión no especificado.";
    } else if (productStatus === ProductStatus.UNUSABLE) {
        productReason = productDetails?.unusableReason as string ?? "Motivo de desuso no especificado.";
    }


    const hasStatusReason = !!productReason;

    const reports = {
        maintenance: hasMaintenance,
        movements: hasMovements
    };

    const availableReports = reportLinks(productCode as string).filter(
        report => reports[report.key as keyof typeof reports]
    );

    return (
        <DetailsLayout
            title="Gestión de Productos"
            sections={[
                // INFORMACION PRINCIPAL
                <DetailCard
                    title={`${productDetails?.name} (${productDetails?.productCode})`}
                    centerTitle
                    showEdit={isAdmin}
                    onEdit={() => navigate("/producto/editar", { state: { productCode: productDetails?.productCode } })}
                >
                    <InfoField label="Nombre" value={productDetails?.name} />
                    <InfoField label="Código" value={productDetails?.productCode} />
                    <InfoField label="Descripción" value={productDetails?.description} />
                    <InfoField label="Observación" value={productDetails?.observation} />
                    <InfoField label="Categoría" value={productCategory ? categoryTranslations[productCategory as ProductCategory] : "No especificada"} />
                    <InfoField label="Condición" value={productCondition ? conditionTranslations[productCondition as ProductCondition] : "No especificada"} />
                    <InfoField label="Factura" value={productDetails?.invoiceNumber ?? "No especificada"} />
                    <InfoField label="Valor" value={formatPrice(productDetails?.purchasePrice) ?? "No especificado"} />
                    <InfoField label="Depreciación" value={formatPrice(productDetails?.depreciation) ?? "No especificada"} />
                    <InfoField label="Cantidad" value={productDetails?.quantity ?? "No especificada"} />
                    <InfoField label="Registrado en" value={formatCalendarDateAR(productDetails?.registrationDate)} />
                </DetailCard>,

                // UBICACION
                <DetailCard
                    label="Ubicación"
                    value={`${productDetails?.department.name} (${formatAreaCode(productDetails?.department.departmentCode ?? "", productDetails?.isLegacy ?? false)})`}
                    showEdit={isAdmin}
                    onEdit={() => navigate("/producto/transferir", { state: { productCode: productDetails?.productCode } })}
                />,


                <DetailCard
                    showEdit={isAdmin}
                    onEdit={() => setShowStatusOptions(!showStatusOptions)}
                    extra={
                        <>
                            {hasStatusReason && (
                                <div className="text-foreground-muted py-2">
                                    <hr className="border-t border-muted my-5" />
                                    <span className="font-bold">Motivo: </span>
                                    {productReason}
                                </div>
                            )}
                            {showStatusOptions && (
                                <div>
                                    <hr className="border-t border-muted my-4" />
                                    <ProductStatusOptions
                                        productCode={productCode as string}
                                        productStatus={productStatus as ProductStatus}
                                        onActionSuccess={refetch}
                                    />
                                </div>
                            )}
                        </>
                    }

                >
                    <InfoField label="Estado" value={<ProductBadgeStatus status={productStatus as ProductStatus} />} />
                    <InfoField label="Desde" value={formatDateAR(productDetails?.statusUpdatedAt)} />

                </DetailCard>,

                // ULTIMA CONSTATACION
                <DetailCard
                    label="Última constatación"
                    value={formatDateAR(productDetails?.lastCheckDate) ?? 'Nunca'}
                    className={needsCheckReview ? "border-2 border-warning" : ""}
                    {...(needsCheckReview && {
                        showEdit: true,
                        icon: <AlertTriangle size={24} strokeWidth={1.5} />,
                        onEdit: () => navigate("/producto/pendientes-revision?tab=CHECK_REVIEW&checkGuidelines=true"),
                        variant: "warning"
                    })}
                />,

                // REPORTES DISPONIBLES
                availableReports.length > 0 && (
                    <Card>
                        <div className="flex flex-wrap items-center gap-4 justify-start text-foreground-muted">
                            <p><span className="font-bold text-foreground-muted">Reportes disponibles: </span></p>
                            <div className="flex flex-wrap items-center gap-6">
                                {availableReports.map((report) => (
                                    <FooterLink key={report.key} label={report.label} to={report.to} />
                                ))}
                            </div>
                        </div>
                    </Card>
                ),
            ]}

        />
    );
}
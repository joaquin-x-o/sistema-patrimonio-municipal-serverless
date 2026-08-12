import { ProductBadgeStatus } from "./ProductBadgeStatus";
import { ProductStatusOptions } from "./ProductStatusOptions";
import { Card } from "../../../ui/Common/Card";
import { Button } from "../../../ui/Common/Button";
import type { ProductFilterTab, ProductStatus } from "../../../../types/product.type";
import type { ProductResponse } from "../../../../schemas/product.schemas";

interface Props {
    product: ProductResponse;
    onBack: () => void;
}


export function ProductStatusSelector({ product, onBack }: Props) {
    return (
        <Card title="Editar estado de producto" centerTitle>
            <div className="flex flex-col gap-8 p-4">
                <div>
                    <div className="mb-2 transform scale-90 text-center">
                        <ProductBadgeStatus status={product?.status as ProductStatus} />
                    </div>

                    <p className="text-foreground-muted font-bold text-center">
                        {product?.name} (COD: {product?.productCode})
                    </p>
                </div>

                <div className="flex justify-center">
                    <ProductStatusOptions
                        productCode={product!.productCode.toString()}
                        productStatus={product!.status as ProductFilterTab}
                    />
                </div>

                <div className="flex justify-center pt-2 border-t border-muted">
                    <Button variant="neutral" className="mt-5" onClick={onBack}>Volver atrás</Button>
                </div>

            </div>
        </Card>
    )
}
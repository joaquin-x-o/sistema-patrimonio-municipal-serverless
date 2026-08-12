import { ModalSearchList } from "../../ui/Modals/ModalSearchList";
import { SearchListFormat } from "../../ui/Search/SearchListFormat";
import type { ProductLightResponse } from "../../../interfaces/responses/productResponses";
import { useProductList } from "../../../hooks/query/products/useProductList";

interface Props {
    isOpen: boolean;
    items?: ProductLightResponse[];
    onClose: () => void;
    onSelect: (code: string) => void;
}

export function ProductSearchModal({ items, isOpen, onClose, onSelect }: Props) {
    const { data: productList } = useProductList();

    return (
        <ModalSearchList<ProductLightResponse>
            isOpen={isOpen}
            onClose={onClose}
            title="Seleccionar producto"
            items={items || productList}
            getKey={(product) => product.productCode}
            getSearchText={(product) => `${product.name} ${product.productCode}`}
            onSelect={(product) => {
                onSelect(product.productCode.toString());
                onClose();
            }}
        >
            {(product: ProductLightResponse) => <SearchListFormat name={product.name} code={product.productCode} />}
        </ModalSearchList>
    );
}
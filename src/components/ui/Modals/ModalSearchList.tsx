import { Modal } from "../Common/Modal";
import { SearchableList } from "../Search/SearchableList";

type Props<T> = {
    isOpen: boolean;
    onClose: () => void;
    title: string;

    items: T[];
    getKey: (item: T) => string | number;
    getSearchText: (item: T) => string;

    onSelect: (item: T) => void;

    children: (item: T) => React.ReactNode;
};

export function ModalSearchList<T>({
    isOpen,
    onClose,
    title,
    items,
    getKey,
    getSearchText,
    onSelect,
    children,
}: Props<T>) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="2xl">
            <div className="flex flex-col gap-4">
                <SearchableList
                    items={items}
                    getKey={getKey}
                    getSearchText={getSearchText}
                    onSelect={(item) => {
                        onSelect(item);
                        onClose();
                    }}
                >
                    {children}
                </SearchableList>
            </div>
        </Modal>
    );
}
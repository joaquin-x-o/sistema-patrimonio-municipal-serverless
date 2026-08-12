import { useDepartmentList } from "../../../hooks/query/departments/useDepartmentList";
import type { DepartmentLightResponse } from "../../../interfaces/responses/departmentResponse";
import { ModalSearchList } from "../../ui/Modals/ModalSearchList";
import { SearchListFormat } from "../../ui/Search/SearchListFormat";


interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (code: string) => void;
}

export function DepartmentSearchModal({ isOpen, onClose, onSelect }: Props) {
    const { data: departmentList } = useDepartmentList();

    return (
        <ModalSearchList<DepartmentLightResponse>
            isOpen={isOpen}
            onClose={onClose}
            title="Seleccionar área"
            items={departmentList}
            getKey={(dept) => dept.code}
            getSearchText={(dept) => `${dept.name} ${dept.code}`}
            onSelect={(dept) => {
                onSelect(dept.code.toString());
                onClose();
            }}
        >
            {(dept: DepartmentLightResponse) => <SearchListFormat name={dept.name} code={dept.code} />}
        </ModalSearchList>
    );
}
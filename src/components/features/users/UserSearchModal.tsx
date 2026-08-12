import { ModalSearchList } from "../../ui/Modals/ModalSearchList";
import { SearchListFormat } from "../../ui/Search/SearchListFormat";
import type { UserLightResponse } from "../../../interfaces/responses/userResponse";
import { useUserList } from "../../../hooks/query/users/useUserList";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (code: string) => void;
}

export function UserSearchModal({ isOpen, onClose, onSelect }: Props) {

    const { data: userList } = useUserList();

    return (
        <ModalSearchList<UserLightResponse>
            isOpen={isOpen}
            onClose={onClose}
            title="Seleccionar usuario"
            items={userList}
            getKey={(user) => user.username}
            getSearchText={(user) => `${user.fullName}`}
            onSelect={(user) => {
                onSelect(user.username.toString());
                onClose();
            }}
        >
            {(user: UserLightResponse) => <SearchListFormat name={user.fullName} />}
        </ModalSearchList>
    );
}
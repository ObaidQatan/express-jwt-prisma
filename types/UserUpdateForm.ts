import AccountUpdateForm from "./AccountUpdateForm";
import ScopeUpdateForm from "./ScopeUpdateForm";
import UserRole from "./UserRole";

interface UserUpdateForm {
    email?: string;
    name?: string;
    imageUrl?: string;
    emailVerified?: boolean;

    account?: AccountUpdateForm;
    scope?: ScopeUpdateForm;
}

export default UserUpdateForm;
import UserRole from "./UserRole";

interface UserRegisterForm {
    email?: string;
    password: string;
    name?: string;
    imageUrl?: string;
    provider: string;
    providerId: string;
    role: UserRole;
    scope?: {
        read?: boolean;
        create?: boolean;
        update?: boolean;
        delete?: boolean;
    }
}

export default UserRegisterForm;
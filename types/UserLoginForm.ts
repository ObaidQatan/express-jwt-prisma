import UserRole from "./UserRole";

interface UserLoginForm {
    email?: string;
    password: string;
    role: UserRole;
}

export default UserLoginForm;
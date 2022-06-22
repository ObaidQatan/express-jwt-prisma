interface UserResponse {
    user:{
        id: string;
        name?: string|null;
        email?: string|null;
        emailVerified?: boolean|null;
        imageUrl?: string|null;
    }
    
    accessToken: string;
}

export default UserResponse;
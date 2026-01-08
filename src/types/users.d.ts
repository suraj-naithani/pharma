export interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    role: string;
    mobileNumber: string;
    partyName: string;
    companyId?: number;
    parentId?: number | null;
}

export interface User {
    id: number;
    userId: string;
    name: string;
    email: string;
    role: string;
    partyName: string;
    mobileNumber: string;
    isActive: number;
    isVerified: number;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    parentId: number;
}

export interface RegisterUserResponse {
    statusCode: number;
    message: string;
    data?: User;
}

export interface UsersResponse {
    statusCode: number;
    data: User[];
}

export interface UserResponse {
    statusCode: number;
    message: string;
    data: User;
}

export interface DeleteUserResponse {
    statusCode: number;
    message: string;
}


export interface Credentials {
    email: string;
    password: string;
}

export interface RegisterData extends Credentials {
    name: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    partyName: string;
}

export interface LoginResponse {
    token: string;
    sessionId: string;
    user: User;
}

export interface RegisterResponse {
    id: string;
    email: string;
    role: string;
}
 
export interface AuthState {
    user: User | null;
    isLoading: boolean;
}

export interface ProtectedRouteProps {
    user: User | null;
    children?: ReactNode;
    redirect?: string;
    requireAuth?: boolean;
}
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    roles: string[];
    user_id: number;
}

export interface User {
    id: number;
    username: string;
    email?: string;
    token: string;
    refreshToken: string;
    roles: string[];
    expiresIn: number;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    roles?: string[];
}

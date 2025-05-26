export interface User {
  id: number;
  username: string;
  email?: string;
  roles: string[];
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    username: string;
    roles: string[];
  };
  token: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}
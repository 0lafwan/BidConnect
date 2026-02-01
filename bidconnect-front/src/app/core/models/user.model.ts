export type UserRole = 'ADMIN' | 'OWNER' | 'SUPPLIER';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface DecodedToken {
  sub: string;
  role: UserRole;
  exp: number;
  iat: number;
}

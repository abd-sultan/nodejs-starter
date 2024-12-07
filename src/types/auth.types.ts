import { User } from '@prisma/client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSuccessResponse extends AuthTokens {
  user: User;
}

export interface TwoFactorResponse {
  requiresTwoFactor: boolean;
  userId: string;
}

export type LoginResponse = AuthSuccessResponse | TwoFactorResponse;

export interface TokenPayload {
  userId: string;
  email: string | null;
  roles: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
import { Request } from 'express';

// ─── Role Enum ─────────────────────────────────────────────────────────────────
export enum UserRole {
  ADMIN        = 'ADMIN',
  SALES        = 'SALES',
  SANCTION     = 'SANCTION',
  DISBURSEMENT = 'DISBURSEMENT',
  COLLECTION   = 'COLLECTION',
  BORROWER     = 'BORROWER',
}

// ─── JWT Payload ───────────────────────────────────────────────────────────────
export interface ITokenPayload {
  id: string;
  role: UserRole;
}

// ─── Augmented Express Request ─────────────────────────────────────────────────
export interface AuthRequest extends Request {
  user?: ITokenPayload;
}

// ─── Data Transfer Objects ─────────────────────────────────────────────────────
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// ─── API Response Shapes ───────────────────────────────────────────────────────
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthResponse {
  success: true;
  token: string;
  user: PublicUser;
}

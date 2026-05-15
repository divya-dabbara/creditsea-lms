import { User } from '../models/user.model';
import { signToken } from '../utils/jwt.utils';
import {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  PublicUser,
  UserRole,
} from '../types/user.types';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const toPublicUser = (user: {
  _id: unknown;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}): PublicUser => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
});

// ─── Register ──────────────────────────────────────────────────────────────────
export const registerUser = async (dto: RegisterDTO): Promise<AuthResponse> => {
  const existing = await User.findOne({ email: dto.email.toLowerCase() });
  if (existing) {
    const err = new Error('Email is already registered');
    (err as NodeJS.ErrnoException).code = '409';
    throw err;
  }

  const user = await User.create({
    name: dto.name,
    email: dto.email,
    password: dto.password,
    role: dto.role ?? UserRole.BORROWER,
  });

  const token = signToken({ id: String(user._id), role: user.role });

  return { success: true, token, user: toPublicUser(user) };
};

// ─── Login ─────────────────────────────────────────────────────────────────────
export const loginUser = async (dto: LoginDTO): Promise<AuthResponse> => {
  // `select('+password')` overrides the `select: false` on the schema field
  const user = await User.findOne({ email: dto.email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(dto.password))) {
    const err = new Error('Invalid email or password');
    (err as NodeJS.ErrnoException).code = '401';
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Account has been deactivated. Contact your administrator.');
    (err as NodeJS.ErrnoException).code = '403';
    throw err;
  }

  const token = signToken({ id: String(user._id), role: user.role });

  return { success: true, token, user: toPublicUser(user) };
};

// ─── Get Current User ──────────────────────────────────────────────────────────
export const getCurrentUser = async (userId: string): Promise<PublicUser> => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const err = new Error('User not found');
    (err as NodeJS.ErrnoException).code = '404';
    throw err;
  }
  return toPublicUser(user);
};

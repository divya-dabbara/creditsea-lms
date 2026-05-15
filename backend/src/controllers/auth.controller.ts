import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { AuthRequest, RegisterDTO, LoginDTO } from '../types/user.types';

// ─── POST /api/auth/register ───────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const dto: RegisterDTO = req.body;
    const result = await AuthService.registerUser(dto);
    res.status(201).json(result);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    const status = err.code === '409' ? 409 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const dto: LoginDTO = req.body;
    const result = await AuthService.loginUser(dto);
    res.status(200).json(result);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    const statusMap: Record<string, number> = { '401': 401, '403': 403 };
    const status = err.code ? (statusMap[err.code] ?? 500) : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ─── GET /api/auth/me  (protected) ────────────────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const user = await AuthService.getCurrentUser(userId);
    res.status(200).json({ success: true, user });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    const status = err.code === '404' ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

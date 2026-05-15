import { Router, Request, Response } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { AuthRequest, UserRole } from '../types/user.types';

const router = Router();

// ─── Public Routes ─────────────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);

// ─── Protected Routes ──────────────────────────────────────────────────────────
router.get('/me', protect, getMe);

// ─── Example: Admin-only route ────────────────────────────────────────────────
router.get(
  '/admin-only',
  protect,
  authorize(UserRole.ADMIN),
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Welcome, Admin!',
      user: (req as AuthRequest).user,
    });
  }
);

// ─── Example: Multi-role route (ADMIN + SANCTION) ─────────────────────────────
router.get(
  '/sanction-desk',
  protect,
  authorize(UserRole.ADMIN, UserRole.SANCTION),
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Sanction desk access granted.',
      user: (req as AuthRequest).user,
    });
  }
);

export default router;

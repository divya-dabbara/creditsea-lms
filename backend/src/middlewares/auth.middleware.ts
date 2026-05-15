import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AuthRequest, UserRole } from '../types/user.types';

// ─── Protect: Verify JWT ───────────────────────────────────────────────────────
export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    (req as AuthRequest).user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token is invalid or has expired.' });
  }
};

// ─── Authorize: Role-based Guard ──────────────────────────────────────────────
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required roles: [${roles.join(', ')}]`,
      });
      return;
    }
    next();
  };
};

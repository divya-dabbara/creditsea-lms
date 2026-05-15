import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[GlobalError] ${err.message}`);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

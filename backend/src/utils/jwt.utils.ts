import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { ITokenPayload } from '../types/user.types';

/**
 * Signs a JWT with the user's id and role.
 */
export const signToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws if the token is invalid or expired.
 */
export const verifyToken = (token: string): ITokenPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as ITokenPayload;
};

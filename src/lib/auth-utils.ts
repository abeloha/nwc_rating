import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { errorResponse } from './api-utils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  adminId: string;
  email: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function hashPassword(password: string): string {
  const bcrypt = require('bcryptjs');
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const bcrypt = require('bcryptjs');
  return bcrypt.compareSync(password, hashedPassword);
}

export function withAuth(handler: (req: Request, token: TokenPayload) => Promise<NextResponse>) {
  return async (req: Request) => {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('Unauthorized - No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse('Unauthorized - Invalid token', 401);
    }

    return handler(req, decoded);
  };
}

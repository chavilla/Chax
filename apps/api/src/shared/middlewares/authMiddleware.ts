import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthUser } from '../auth/AuthUser';

const JWT_SECRET = process.env.JWT_SECRET ?? 'chax-dev-secret-change-in-production';

function extractBearerToken(req: Request): string | null {
    const auth = req.headers.authorization;
    if (!auth || typeof auth !== 'string') return null;
    const [scheme, token] = auth.trim().split(/\s+/);
    return scheme?.toLowerCase() === 'bearer' ? token ?? null : null;
}

/**
 * Verifica JWT y asigna req.user. No aplica a /health ni a POST /api/auth/login.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (req.path === '/health') {
        next();
        return;
    }
    if (req.path === '/api/auth/login' && req.method === 'POST') {
        next();
        return;
    }
    if (!req.path.startsWith('/api')) {
        next();
        return;
    }

    const token = extractBearerToken(req);
    if (!token) {
        res.status(401).json({ error: 'Token requerido' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            organizationId: decoded.organizationId ?? null,
        };
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

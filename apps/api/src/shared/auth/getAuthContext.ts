import { Response } from 'express';
import { AuthUser } from './AuthUser';

export interface AuthContext {
    userId: string;
    organizationId: string;
}

/**
 * Obtiene organizationId para uso en use cases.
 * - Usuario con org: usa req.user.organizationId.
 * - SUPER_ADMIN (organizationId null): usa query o body; si no viene, responde 400 y retorna null.
 * El controller debe chequear el return y no llamar al use case si es null (ya se envió respuesta).
 */
export function getOrganizationIdFromRequest(
    req: { user?: AuthUser; query?: Record<string, unknown>; body?: Record<string, unknown> },
    res: Response,
    source: 'query' | 'body' | 'queryOrBody' = 'queryOrBody'
): string | null {
    const user = req.user;
    if (!user) return null;

    if (user.organizationId) return user.organizationId;

    const fromQuery = (req.query?.organizationId as string)?.trim();
    const fromBody = (req.body?.organizationId as string)?.trim();
    const value = source === 'query' ? fromQuery : source === 'body' ? fromBody : fromQuery || fromBody;
    if (value) return value;

    res.status(400).json({
        error: 'Se requiere organizationId (usuario sin organización asignada).',
    });
    return null;
}

/**
 * Obtiene userId (para performedByUserId en auditoría). Requiere req.user.
 */
export function getUserId(req: { user?: AuthUser }): string | null {
    return req.user?.id ?? null;
}

/**
 * Devuelve contexto de auth listo para inyectar en DTOs.
 * Si el usuario no tiene org y no se envió organizationId, escribe 400 en res y retorna null.
 */
export function getAuthContext(
    req: { user?: AuthUser; query?: Record<string, unknown>; body?: Record<string, unknown> },
    res: Response,
    source: 'query' | 'body' | 'queryOrBody' = 'queryOrBody'
): AuthContext | null {
    const userId = getUserId(req);
    const organizationId = getOrganizationIdFromRequest(req, res, source);
    if (!userId || !organizationId) return null;
    return { userId, organizationId };
}

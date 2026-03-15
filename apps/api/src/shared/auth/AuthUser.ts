/**
 * Usuario autenticado (payload del JWT / req.user).
 * organizationId es null para SUPER_ADMIN.
 */
export interface AuthUser {
    id: string;
    email: string;
    role: string;
    organizationId: string | null;
}

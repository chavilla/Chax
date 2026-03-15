import type { AuthUser } from '../auth/AuthUser';

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export {};

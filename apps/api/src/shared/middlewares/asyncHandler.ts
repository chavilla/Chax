import { Request, Response, RequestHandler } from 'express';
import { AppError } from '../errors/AppError';

type AsyncRequestHandler = (req: Request, res: Response) => Promise<Response | void>;

/**
 * Envuelve un handler async y centraliza el manejo de errores:
 * - AppError → statusCode y { error: message }
 * - Resto → 500 y mensaje genérico
 * Elimina la necesidad de try/catch repetido en controladores.
 */
export function handleAsync(handler: AsyncRequestHandler): RequestHandler {
    return (req: Request, res: Response) => {
        Promise.resolve(handler(req, res)).catch((err: unknown) => {
            if (err instanceof AppError) {
                res.status(err.statusCode).json({ error: err.message });
            } else {
                res.status(500).json({ status: 'error', message: 'Internal server error' });
            }
        });
    };
}

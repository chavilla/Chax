import { z } from 'zod';

/** Opcional: quien realizó la acción (para auditoría). Enviar desde el front o desde el token JWT. */
export const performedByUserIdSchema = z.string().uuid().optional();

import { z } from 'zod';

export const LoginSchema = z.object({
    body: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(1, 'La contraseña es requerida'),
    }),
});

export type LoginDTO = z.infer<typeof LoginSchema>['body'];

import { z } from 'zod';

export const CreateCashSessionSchema = z.object({
    body: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
        userId: z.string().uuid('userId debe ser un UUID'),
        openingAmount: z.number().min(0, 'El monto de apertura no puede ser negativo'),
        notes: z.string().optional().nullable(),
    }),
});

export const CloseCashSessionSchema = z.object({
    params: z.object({
        id: z.string().uuid('id de sesión de caja debe ser un UUID'),
    }),
    body: z.object({
        closingAmount: z.number().min(0, 'El monto de cierre no puede ser negativo'),
        expectedAmount: z.number().optional().nullable(),
        difference: z.number().optional().nullable(),
        totalCash: z.number().min(0).optional().nullable(),
        totalCard: z.number().min(0).optional().nullable(),
        totalTransfer: z.number().min(0).optional().nullable(),
        notes: z.string().optional().nullable(),
    }),
});

export const GetCashSessionSchema = z.object({
    params: z.object({
        id: z.string().uuid('id de sesión debe ser un UUID'),
    }),
});

export const GetCashSessionsSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
        isClosed: z
            .enum(['true', 'false'])
            .optional()
            .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
    }),
});

export type CreateCashSessionDTO = z.infer<typeof CreateCashSessionSchema>['body'];
export type CloseCashSessionDTO = z.infer<typeof CloseCashSessionSchema>['body'] & {
    id: string;
};
export type GetCashSessionsQuery = z.infer<typeof GetCashSessionsSchema>['query'];

import { z } from 'zod';

export const GetKardexSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
        productId: z.string().uuid('productId debe ser un UUID'),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
    }),
});

export type GetKardexQuery = z.infer<typeof GetKardexSchema>['query'];

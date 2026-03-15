import { z } from 'zod';
import { uuidSchema } from '@chax/shared';

export const GetDianLogSchema = z.object({
    params: z.object({ id: uuidSchema }),
});

export const GetByInvoiceSchema = z.object({
    query: z.object({ invoiceId: uuidSchema }),
});

export const GetByOrganizationSchema = z.object({
    query: z.object({
        organizationId: uuidSchema,
        limit: z.coerce.number().int().min(1).max(500).optional(),
    }),
});

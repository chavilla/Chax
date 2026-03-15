import { z } from 'zod';
import { uuidSchema } from '@chax/shared';

export const GetAuditLogSchema = z.object({
    params: z.object({ id: uuidSchema }),
});

export const GetByOrganizationSchema = z.object({
    query: z.object({
        organizationId: uuidSchema,
        entity: z.string().optional(),
        entityId: uuidSchema.optional(),
        userId: uuidSchema.optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
        limit: z.coerce.number().int().min(1).max(500).optional(),
    }),
});

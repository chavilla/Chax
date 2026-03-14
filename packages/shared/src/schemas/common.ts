import { z } from 'zod';

/**
 * Schemas Zod reutilizables para validación en API y formularios en Web.
 */

export const uuidSchema = z.string().uuid('Debe ser un UUID válido');

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const organizationIdQuerySchema = z.object({
  organizationId: uuidSchema,
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type OrganizationIdQuery = z.infer<typeof organizationIdQuerySchema>;

import { z } from 'zod';

/** Campos comunes. Los de DIAN (resolutionNumber, startDate, endDate, technicalKey) son opcionales en el schema;
 * el use case exige que estén presentes cuando la organización tiene usesDian = true. */
const invoiceResolutionBodyFields = {
    name: z.string().optional().nullable(),
    resolutionNumber: z.string().optional().nullable(),
    prefix: z.string().min(1, 'El prefijo es requerido').max(20, 'Máximo 20 caracteres'),
    rangeStart: z.number().int().min(0, 'rangeStart debe ser >= 0'),
    rangeEnd: z.number().int().min(1, 'rangeEnd debe ser >= 1'),
    currentNumber: z.number().int().min(0).optional(),
    startDate: z.coerce.date().optional().nullable(),
    endDate: z.coerce.date().optional().nullable(),
    technicalKey: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    organizationId: z.string().uuid('organizationId debe ser un UUID'),
};

const createBodySchema = z.object(invoiceResolutionBodyFields);
const updateBodySchema = z.object(invoiceResolutionBodyFields).partial();

export const CreateInvoiceResolutionSchema = z.object({
    body: createBodySchema,
});

export const UpdateInvoiceResolutionSchema = z.object({
    params: z.object({
        id: z.string().uuid('id de resolución debe ser un UUID'),
    }),
    body: updateBodySchema,
});

export const GetInvoiceResolutionsSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
    }),
});

export const GetInvoiceResolutionSchema = z.object({
    params: z.object({
        id: z.string().uuid('id de resolución debe ser un UUID'),
    }),
});

export type CreateInvoiceResolutionDTO = z.infer<typeof createBodySchema>;
export type UpdateInvoiceResolutionDTO = { id: string } & z.infer<typeof updateBodySchema>;

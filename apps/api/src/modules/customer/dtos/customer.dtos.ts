import { z } from 'zod';
import { IdType, TaxRegime } from '@chax/shared';

const idNumberSchema = z
    .string()
    .min(5, 'El número de documento debe tener al menos 5 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres');

const nameSchema = z
    .string()
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .refine(
        (val) => val.trim().split(/\s+/).filter(Boolean).length >= 2,
        'Debe incluir al menos nombre y apellido'
    );

const customerBodyFields = {
    idType: z.nativeEnum(IdType).optional(),
    idNumber: idNumberSchema,
    dv: z.string().optional(),
    name: nameSchema,
    email: z.string().email('Invalid email').optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    taxRegime: z.nativeEnum(TaxRegime).optional(),
    fiscalResponsibilities: z.string().optional().nullable(),
    organizationId: z.string().uuid('Invalid organization ID'),
};

const createBodySchema = z.object(customerBodyFields);
const updateBodySchema = z.object(customerBodyFields).partial();

export const CreateCustomerSchema = z.object({
    body: createBodySchema,
});

export const UpdateCustomerSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid customer ID'),
    }),
    body: updateBodySchema,
});

export const GetCustomersSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId must be a valid UUID'),
    }),
});

export type CreateCustomerDTO = z.infer<typeof createBodySchema>;
export type UpdateCustomerDTO = { id: string } & z.infer<typeof updateBodySchema>;

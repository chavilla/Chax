import { z } from 'zod';
import { IdType } from '@prisma/client';

const idNumberSchema = z
    .string()
    .min(5, 'El número de documento debe tener al menos 5 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres');

const supplierBodyFields = {
    idType: z.nativeEnum(IdType, { message: 'idType es requerido (CC, NIT, CE, TI, PP, DIE)' }),
    idNumber: idNumberSchema,
    name: z.string().min(2, 'La razón social debe tener al menos 2 caracteres'),
    contactName: z
        .string()
        .min(2, 'El nombre del contacto es requerido y debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido').optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    organizationId: z.string().uuid('organizationId debe ser un UUID'),
};

const createBodySchema = z.object(supplierBodyFields);
const updateBodySchema = z.object(supplierBodyFields).partial();

export const CreateSupplierSchema = z.object({
    body: createBodySchema,
});

export const UpdateSupplierSchema = z.object({
    params: z.object({
        id: z.string().uuid('id de proveedor debe ser un UUID'),
    }),
    body: updateBodySchema,
});

export const GetSuppliersSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
    }),
});

export type CreateSupplierDTO = z.infer<typeof createBodySchema>;
export type UpdateSupplierDTO = { id: string } & z.infer<typeof updateBodySchema>;

import { z } from 'zod';
import { TaxType } from '@prisma/client';

const decimalSchema = z.number().min(0, 'El valor no puede ser negativo');

const productBodyFields = {
    internalCode: z.string().min(1, 'El código interno es requerido').optional(),
    internalCodePrefix: z
        .string()
        .max(10, 'El prefijo no puede exceder 10 caracteres')
        .regex(/^[A-Za-z0-9]*$/, 'El prefijo solo puede contener letras y números')
        .optional(),
    barcode: z.string().optional().nullable(),
    name: z.string().min(2, 'El nombre es requerido'),
    description: z.string().optional().nullable(),
    salePrice: decimalSchema,
    costPrice: decimalSchema.optional(), // opcional al crear (default 0); útil para margen e inventario
    unitOfMeasure: z.string().optional(),
    taxType: z.nativeEnum(TaxType).optional(),
    taxPercentage: z.number().min(0).max(100).optional(),
    stock: z.number().int().min(0).optional(),
    minStock: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
    categoryId: z.string().uuid('Invalid category ID').optional().nullable(),
    organizationId: z.string().uuid('Invalid organization ID'),
};

const createBodySchema = z.object(productBodyFields);
const updateBodySchema = z.object(productBodyFields).partial();

export const CreateProductSchema = z.object({
    body: createBodySchema,
});

export const UpdateProductSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid product ID'),
    }),
    body: updateBodySchema,
});

export const GetProductsSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId must be a valid UUID'),
    }),
});

export const DeleteProductSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid product ID'),
    }),
    query: z.object({
        organizationId: z.string().uuid('organizationId must be a valid UUID'),
    }),
});

export type CreateProductDTO = z.infer<typeof createBodySchema>;
export type UpdateProductDTO = { id: string } & z.infer<typeof updateBodySchema>;

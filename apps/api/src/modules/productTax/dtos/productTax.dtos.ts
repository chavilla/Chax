import { z } from 'zod';
import { TaxType } from '@chax/shared';
import { uuidSchema } from '@chax/shared';

const productTaxBodyFields = {
    productId: uuidSchema,
    taxType: z.nativeEnum(TaxType),
    percentage: z.number().min(0, 'Debe ser >= 0').max(100, 'Debe ser <= 100'),
    fixedAmount: z.number().min(0).nullable().optional(),
};

const createBodySchema = z.object(productTaxBodyFields);
const updateBodySchema = z.object(productTaxBodyFields).partial();

export const CreateProductTaxSchema = z.object({
    body: createBodySchema,
});

export const UpdateProductTaxSchema = z.object({
    params: z.object({ id: uuidSchema }),
    body: updateBodySchema,
});

export const GetProductTaxesByProductSchema = z.object({
    query: z.object({ productId: uuidSchema }),
});

export const GetProductTaxSchema = z.object({
    params: z.object({ id: uuidSchema }),
});

export const DeleteProductTaxSchema = z.object({
    params: z.object({ id: uuidSchema }),
});

export type CreateProductTaxDTO = z.infer<typeof createBodySchema>;
export type UpdateProductTaxDTO = { id: string } & z.infer<typeof updateBodySchema>;

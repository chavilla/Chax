import { z } from 'zod';
import { performedByUserIdSchema } from '../../../shared/schemas/audit';

const purchaseItemSchema = z.object({
    productId: z.string().uuid('productId debe ser un UUID'),
    quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
    unitCost: z.number().min(0, 'El costo unitario no puede ser negativo'),
});

export const CreatePurchaseSchema = z.object({
    body: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
        supplierId: z.string().uuid('supplierId debe ser un UUID'),
        purchaseDate: z.coerce.date().optional(),
        reference: z.string().optional().nullable(),
        notes: z.string().optional().nullable(),
        items: z.array(purchaseItemSchema).min(1, 'Debe incluir al menos un ítem'),
        performedByUserId: performedByUserIdSchema,
    }),
});

export const GetPurchaseSchema = z.object({
    params: z.object({
        id: z.string().uuid('id de compra debe ser un UUID'),
    }),
});

export const GetPurchasesSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
    }),
});

export type CreatePurchaseDTO = z.infer<typeof CreatePurchaseSchema>['body'];

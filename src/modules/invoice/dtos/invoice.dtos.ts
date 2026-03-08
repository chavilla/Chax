import { z } from 'zod';
import { InvoiceType } from '@prisma/client';

const invoiceItemSchema = z.object({
    productId: z.string().uuid('productId debe ser un UUID'),
    quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
    unitPrice: z.number().min(0, 'El precio unitario no puede ser negativo').optional(),
    discount: z.number().min(0).optional(),
    taxPercentage: z.number().min(0).max(100).optional(),
});

export const CreateInvoiceSchema = z.object({
    body: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
        customerId: z.string().uuid('customerId debe ser un UUID'),
        createdByUserId: z.string().uuid('createdByUserId debe ser un UUID'),
        resolutionId: z.string().uuid('resolutionId debe ser un UUID').optional().nullable(),
        type: z.nativeEnum(InvoiceType).optional(),
        notes: z.string().optional().nullable(),
        dueDate: z.coerce.date().optional().nullable(),
        cashSessionId: z.string().uuid().optional().nullable(),
        items: z.array(invoiceItemSchema).min(1, 'Debe incluir al menos un ítem'),
    }),
});

export const GetInvoiceSchema = z.object({
    params: z.object({
        id: z.string().uuid('id de factura debe ser un UUID'),
    }),
});

export const GetInvoicesSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
    }),
});

export type CreateInvoiceDTO = z.infer<typeof CreateInvoiceSchema>['body'];
export type CreateInvoiceItemInput = z.infer<typeof invoiceItemSchema>;

import { z } from 'zod';
import { InvoiceType, PaymentMethod } from '@chax/shared';
import { performedByUserIdSchema } from '../../../shared/schemas/audit';

const taxBreakdownItemSchema = z.object({
    dianCode: z.string().min(1, 'Código DIAN requerido').max(10),
    taxBase: z.number().min(0),
    taxPercentage: z.number().min(0).max(100),
    taxAmount: z.number().min(0),
});

const invoiceItemSchema = z.object({
    productId: z.string().uuid('productId debe ser un UUID'),
    quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
    unitPrice: z.number().min(0, 'El precio unitario no puede ser negativo').optional(),
    discount: z.number().min(0).optional(),
    taxPercentage: z.number().min(0).max(100).optional(),
    taxBreakdown: z.array(taxBreakdownItemSchema).optional(),
});

/** Opcional. Si se envía y la suma cubre el total, la factura queda PAGADA (venta de contado). */
const paymentInputSchema = z.object({
    amount: z.number().min(0.01, 'El monto del pago debe ser mayor a 0'),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
    reference: z.string().optional().nullable(),
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
        payments: z.array(paymentInputSchema).optional(),
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

/** Registrar abono a una factura existente (params.id = invoiceId). */
export const RegisterPaymentSchema = z.object({
    params: z.object({
        id: z.string().uuid('id de factura debe ser un UUID'),
    }),
    body: z.object({
        amount: z.number().min(0.01, 'El monto del pago debe ser mayor a 0'),
        paymentMethod: z.nativeEnum(PaymentMethod).optional(),
        reference: z.string().optional().nullable(),
        performedByUserId: performedByUserIdSchema,
    }),
});

export type CreateInvoiceDTO = z.infer<typeof CreateInvoiceSchema>['body'];
export type CreateInvoiceItemInput = z.infer<typeof invoiceItemSchema>;
export type RegisterPaymentDTO = z.infer<typeof RegisterPaymentSchema>['body'] & { invoiceId: string };

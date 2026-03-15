import { z } from 'zod';
import { uuidSchema } from '@chax/shared';

const dianCodeSchema = z.string().min(1, 'Código DIAN requerido').max(10);
const decimalSchema = z.number().min(0);

const createBodySchema = z.object({
    invoiceItemId: uuidSchema,
    dianCode: dianCodeSchema,
    taxBase: decimalSchema,
    taxPercentage: z.number().min(0).max(100),
    taxAmount: decimalSchema,
});

export const CreateInvoiceItemTaxSchema = z.object({
    body: createBodySchema,
});

export const GetInvoiceItemTaxSchema = z.object({
    params: z.object({ id: uuidSchema }),
});

export const GetByInvoiceItemSchema = z.object({
    query: z.object({ invoiceItemId: uuidSchema }),
});

export const DeleteInvoiceItemTaxSchema = z.object({
    params: z.object({ id: uuidSchema }),
});

export type CreateInvoiceItemTaxDTO = z.infer<typeof createBodySchema>;

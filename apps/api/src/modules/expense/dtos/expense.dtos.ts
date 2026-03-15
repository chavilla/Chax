import { z } from 'zod';
import { ExpenseCategory } from '@chax/shared';
import { performedByUserIdSchema } from '../../../shared/schemas/audit';

export const CreateExpenseSchema = z.object({
    body: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
        category: z.nativeEnum(ExpenseCategory).optional(),
        description: z.string().min(1, 'La descripción es requerida'),
        amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
        expenseDate: z.coerce.date().optional(),
        reference: z.string().optional().nullable(),
        notes: z.string().optional().nullable(),
        performedByUserId: performedByUserIdSchema,
    }),
});

export const GetExpenseSchema = z.object({
    params: z.object({
        id: z.string().uuid('id de gasto debe ser un UUID'),
    }),
});

export const GetExpensesSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
    }),
});

export type CreateExpenseDTO = z.infer<typeof CreateExpenseSchema>['body'];

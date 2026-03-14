import { Entity } from '../../../../shared/core/Entity';
import type { ExpenseProps } from '@chax/shared';

export type { ExpenseProps } from '@chax/shared';

export class Expense extends Entity<ExpenseProps> {
    private constructor(props: ExpenseProps, id?: string) {
        super(props, id);
    }

    public static create(props: ExpenseProps, id?: string): Expense {
        if (!props.organizationId?.trim()) {
            throw new Error('El gasto debe pertenecer a una organización');
        }
        if (!props.description?.trim()) {
            throw new Error('La descripción del gasto es requerida');
        }
        if (props.amount <= 0) {
            throw new Error('El monto del gasto debe ser mayor a 0');
        }
        return new Expense(
            {
                ...props,
                expenseDate: props.expenseDate ?? new Date(),
            },
            id
        );
    }
}

import type { ExpenseCategory } from '../../enums';

export interface ExpenseProps {
  category: ExpenseCategory;
  description: string;
  amount: number;
  expenseDate: Date;
  reference?: string | null;
  notes?: string | null;
  organizationId: string;
}

/** Forma de Expense en respuestas API / frontend */
export interface Expense extends ExpenseProps {
  id: string;
}

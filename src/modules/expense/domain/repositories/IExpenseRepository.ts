import { Expense } from '../entities/Expense';

export interface IExpenseRepository {
    save(expense: Expense): Promise<void>;
    findById(id: string): Promise<Expense | null>;
    findAllByOrganization(organizationId: string): Promise<Expense[]>;
}

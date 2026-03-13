import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IExpenseRepository } from '../domain/repositories/IExpenseRepository';
import { Expense } from '../domain/entities/Expense';
import { ExpenseRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetExpensesUseCase implements UseCase<string, Expense[]> {
    constructor(
        @inject(ExpenseRepositoryToken) private readonly expenseRepository: IExpenseRepository
    ) {}

    async execute(organizationId: string): Promise<Expense[]> {
        return this.expenseRepository.findAllByOrganization(organizationId);
    }
}

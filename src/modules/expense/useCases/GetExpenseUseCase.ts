import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IExpenseRepository } from '../domain/repositories/IExpenseRepository';
import { Expense } from '../domain/entities/Expense';
import { AppError } from '../../../shared/errors/AppError';
import { ExpenseRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetExpenseUseCase implements UseCase<string, Expense> {
    constructor(
        @inject(ExpenseRepositoryToken) private readonly expenseRepository: IExpenseRepository
    ) {}

    async execute(id: string): Promise<Expense> {
        const expense = await this.expenseRepository.findById(id);
        if (!expense) {
            throw new AppError('Gasto no encontrado', 404);
        }
        return expense;
    }
}

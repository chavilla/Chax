import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateExpenseUseCase } from '../useCases/CreateExpenseUseCase';
import { GetExpenseUseCase } from '../useCases/GetExpenseUseCase';
import { GetExpensesUseCase } from '../useCases/GetExpensesUseCase';
import { AppError } from '../../../shared/errors/AppError';
import type { Expense } from '../domain/entities/Expense';

@injectable()
export class ExpenseController {
    constructor(
        private readonly createExpenseUseCase: CreateExpenseUseCase,
        private readonly getExpenseUseCase: GetExpenseUseCase,
        private readonly getExpensesUseCase: GetExpensesUseCase
    ) {}

    private toResponse(expense: Expense) {
        return {
            id: expense.id,
            category: expense.props.category,
            description: expense.props.description,
            amount: expense.props.amount,
            expenseDate: expense.props.expenseDate,
            reference: expense.props.reference ?? null,
            notes: expense.props.notes ?? null,
            organizationId: expense.props.organizationId,
        };
    }

    async create(request: Request, response: Response): Promise<Response> {
        try {
            const expense = await this.createExpenseUseCase.execute(request.body);
            return response.status(201).json(this.toResponse(expense));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async getById(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            const expense = await this.getExpenseUseCase.execute(id);
            return response.status(200).json(this.toResponse(expense));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async getExpenses(request: Request, response: Response): Promise<Response> {
        try {
            const organizationId = request.query.organizationId as string;
            const expenses = await this.getExpensesUseCase.execute(organizationId);
            return response.status(200).json(expenses.map((e) => this.toResponse(e)));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}

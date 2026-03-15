import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateExpenseUseCase } from '../useCases/CreateExpenseUseCase';
import { GetExpenseUseCase } from '../useCases/GetExpenseUseCase';
import { GetExpensesUseCase } from '../useCases/GetExpensesUseCase';
import type { Expense } from '../domain/entities/Expense';
import { getOrganizationIdFromRequest, getAuthContext } from '../../../shared/auth/getAuthContext';

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
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const expense = await this.createExpenseUseCase.execute({
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(201).json(this.toResponse(expense));
    }

    async getById(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const expense = await this.getExpenseUseCase.execute(id);
        return response.status(200).json(this.toResponse(expense));
    }

    async getExpenses(request: Request, response: Response): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const expenses = await this.getExpensesUseCase.execute(organizationId);
        return response.status(200).json(expenses.map((e) => this.toResponse(e)));
    }
}

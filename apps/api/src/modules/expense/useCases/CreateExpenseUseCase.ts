import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IExpenseRepository } from '../domain/repositories/IExpenseRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { Expense } from '../domain/entities/Expense';
import { AppError } from '../../../shared/errors/AppError';
import { ExpenseRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';
import { AuditRecorder } from '../../../shared/audit/AuditRecorder';
import { ExpenseCategory } from '@chax/shared';
import type { CreateExpenseDTO } from '../dtos/expense.dtos';

@injectable()
export class CreateExpenseUseCase implements UseCase<CreateExpenseDTO, Expense> {
    constructor(
        @inject(ExpenseRepositoryToken) private readonly expenseRepository: IExpenseRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(AuditRecorder) private readonly auditRecorder: AuditRecorder
    ) {}

    async execute(request: CreateExpenseDTO): Promise<Expense> {
        const organization = await this.organizationRepository.findById(request.organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }

        const expense = Expense.create({
            category: request.category ?? ExpenseCategory.OTRO,
            description: request.description,
            amount: request.amount,
            expenseDate: request.expenseDate ? new Date(request.expenseDate) : new Date(),
            reference: request.reference ?? null,
            notes: request.notes ?? null,
            organizationId: request.organizationId,
        });

        await this.expenseRepository.save(expense);
        await this.auditRecorder.recordIfUser(request.performedByUserId, {
            action: 'CREATE',
            entity: 'Expense',
            entityId: expense.id,
            newValues: { category: expense.props.category, description: expense.props.description, amount: expense.props.amount, organizationId: expense.props.organizationId },
            organizationId: expense.props.organizationId,
        });
        return expense;
    }
}

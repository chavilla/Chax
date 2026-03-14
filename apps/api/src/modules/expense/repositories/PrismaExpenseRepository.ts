import { injectable } from 'tsyringe';
import { IExpenseRepository } from '../domain/repositories/IExpenseRepository';
import { Expense, ExpenseProps } from '../domain/entities/Expense';
import { prisma } from '../../../infrastructure/database/prisma';

type PrismaExpense = NonNullable<Awaited<ReturnType<typeof prisma.expense.findUnique>>>;

@injectable()
export class PrismaExpenseRepository implements IExpenseRepository {
    async save(expense: Expense): Promise<void> {
        await prisma.expense.create({
            data: {
                id: expense.id,
                category: expense.props.category as PrismaExpense['category'],
                description: expense.props.description,
                amount: expense.props.amount,
                expenseDate: expense.props.expenseDate,
                reference: expense.props.reference ?? null,
                notes: expense.props.notes ?? null,
                organizationId: expense.props.organizationId,
            },
        });
    }

    async findById(id: string): Promise<Expense | null> {
        const row = await prisma.expense.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.mapToDomain(row);
    }

    async findAllByOrganization(organizationId: string): Promise<Expense[]> {
        const list = await prisma.expense.findMany({
            where: { organizationId },
            orderBy: { expenseDate: 'desc' },
        });
        return list.map((r: PrismaExpense) => this.mapToDomain(r));
    }

    private mapToDomain(row: PrismaExpense): Expense {
        const props: ExpenseProps = {
            category: row.category as ExpenseProps['category'],
            description: row.description,
            amount: Number(row.amount),
            expenseDate: row.expenseDate,
            reference: row.reference ?? null,
            notes: row.notes ?? null,
            organizationId: row.organizationId,
        };
        return Expense.create(props, row.id);
    }
}

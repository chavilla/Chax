import { injectable } from 'tsyringe';
import {
    ICashSessionRepository,
    CloseCashSessionData,
} from '../domain/repositories/ICashSessionRepository';
import { CashSession, CashSessionProps } from '../domain/entities/CashSession';
import { prisma } from '../../../infrastructure/database/prisma';

type PrismaCashSession = NonNullable<Awaited<ReturnType<typeof prisma.cashSession.findUnique>>>;

@injectable()
export class PrismaCashSessionRepository implements ICashSessionRepository {
    async save(session: CashSession): Promise<void> {
        await prisma.cashSession.create({
            data: {
                id: session.id,
                openingAmount: session.props.openingAmount,
                closingAmount: session.props.closingAmount ?? null,
                expectedAmount: session.props.expectedAmount ?? null,
                difference: session.props.difference ?? null,
                totalCash: session.props.totalCash ?? null,
                totalCard: session.props.totalCard ?? null,
                totalTransfer: session.props.totalTransfer ?? null,
                openedAt: session.props.openedAt,
                closedAt: session.props.closedAt ?? null,
                notes: session.props.notes ?? null,
                isClosed: session.props.isClosed,
                userId: session.props.userId,
                organizationId: session.props.organizationId,
            },
        });
    }

    async findById(id: string): Promise<CashSession | null> {
        const row = await prisma.cashSession.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.mapToDomain(row);
    }

    async findAllByOrganization(
        organizationId: string,
        options?: { isClosed?: boolean }
    ): Promise<CashSession[]> {
        const where: { organizationId: string; isClosed?: boolean } = { organizationId };
        if (options?.isClosed !== undefined) {
            where.isClosed = options.isClosed;
        }
        const list = await prisma.cashSession.findMany({
            where,
            orderBy: { openedAt: 'desc' },
        });
        return list.map((r: PrismaCashSession) => this.mapToDomain(r));
    }

    async update(session: CashSession): Promise<void> {
        await prisma.cashSession.update({
            where: { id: session.id },
            data: {
                closingAmount: session.props.closingAmount ?? null,
                expectedAmount: session.props.expectedAmount ?? null,
                difference: session.props.difference ?? null,
                totalCash: session.props.totalCash ?? null,
                totalCard: session.props.totalCard ?? null,
                totalTransfer: session.props.totalTransfer ?? null,
                closedAt: session.props.closedAt ?? null,
                notes: session.props.notes ?? null,
                isClosed: session.props.isClosed,
            },
        });
    }

    private mapToDomain(row: PrismaCashSession): CashSession {
        const props: CashSessionProps = {
            openingAmount: Number(row.openingAmount),
            closingAmount: row.closingAmount != null ? Number(row.closingAmount) : null,
            expectedAmount: row.expectedAmount != null ? Number(row.expectedAmount) : null,
            difference: row.difference != null ? Number(row.difference) : null,
            totalCash: row.totalCash != null ? Number(row.totalCash) : null,
            totalCard: row.totalCard != null ? Number(row.totalCard) : null,
            totalTransfer: row.totalTransfer != null ? Number(row.totalTransfer) : null,
            openedAt: row.openedAt,
            closedAt: row.closedAt ?? null,
            notes: row.notes ?? null,
            isClosed: row.isClosed,
            userId: row.userId,
            organizationId: row.organizationId,
        };
        return CashSession.create(props, row.id);
    }
}

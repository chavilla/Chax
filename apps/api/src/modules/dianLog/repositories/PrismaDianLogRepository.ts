import { injectable } from 'tsyringe';
import { IDianLogRepository } from '../domain/repositories/IDianLogRepository';
import { DianLog } from '../domain/entities/DianLog';
import { prisma } from '../../../infrastructure/database/prisma';

type PrismaDianLog = NonNullable<
    Awaited<ReturnType<typeof prisma.dianLog.findUnique>>
>;

@injectable()
export class PrismaDianLogRepository implements IDianLogRepository {
    async findById(id: string): Promise<DianLog | null> {
        const row = await prisma.dianLog.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.mapToDomain(row);
    }

    async findByInvoiceId(invoiceId: string): Promise<DianLog[]> {
        const list = await prisma.dianLog.findMany({
            where: { invoiceId },
            orderBy: { createdAt: 'desc' },
        });
        return list.map((r: PrismaDianLog) => this.mapToDomain(r));
    }

    async findByOrganizationId(
        organizationId: string,
        limit = 100
    ): Promise<DianLog[]> {
        const list = await prisma.dianLog.findMany({
            where: { invoice: { organizationId } },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return list.map((r: PrismaDianLog) => this.mapToDomain(r));
    }

    private mapToDomain(row: PrismaDianLog): DianLog {
        return DianLog.create(
            {
                action: row.action,
                requestXml: row.requestXml ?? null,
                responseXml: row.responseXml ?? null,
                statusCode: row.statusCode ?? null,
                dianResponseCode: row.dianResponseCode ?? null,
                success: row.success,
                errorMessage: row.errorMessage ?? null,
                invoiceId: row.invoiceId,
                createdAt: row.createdAt,
            },
            row.id
        );
    }
}

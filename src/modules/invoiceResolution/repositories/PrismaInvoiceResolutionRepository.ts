import { injectable } from 'tsyringe';
import { IInvoiceResolutionRepository } from '../domain/repositories/IInvoiceResolutionRepository';
import { InvoiceResolution, InvoiceResolutionProps } from '../domain/entities/InvoiceResolution';
import { prisma } from '../../../infrastructure/database/prisma';
import { InvoiceResolution as PrismaInvoiceResolution } from '@prisma/client';

@injectable()
export class PrismaInvoiceResolutionRepository implements IInvoiceResolutionRepository {
    async save(resolution: InvoiceResolution): Promise<void> {
        const data = {
            id: resolution.id,
            name: resolution.props.name ?? null,
            resolutionNumber: resolution.props.resolutionNumber ?? null,
            prefix: resolution.props.prefix,
            rangeStart: resolution.props.rangeStart,
            rangeEnd: resolution.props.rangeEnd,
            currentNumber: resolution.props.currentNumber,
            startDate: resolution.props.startDate ?? null,
            endDate: resolution.props.endDate ?? null,
            technicalKey: resolution.props.technicalKey ?? null,
            isActive: resolution.props.isActive,
            organizationId: resolution.props.organizationId,
        };

        await prisma.invoiceResolution.upsert({
            where: { id: resolution.id },
            update: data,
            create: data,
        });
    }

    async findById(id: string): Promise<InvoiceResolution | null> {
        const row = await prisma.invoiceResolution.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.mapToDomain(row);
    }

    async findAllByOrganization(organizationId: string): Promise<InvoiceResolution[]> {
        const list = await prisma.invoiceResolution.findMany({
            where: { organizationId },
            orderBy: { prefix: 'asc' },
        });
        return list.map((r) => this.mapToDomain(r));
    }

    private mapToDomain(row: PrismaInvoiceResolution): InvoiceResolution {
        const props: InvoiceResolutionProps = {
            name: row.name ?? undefined,
            resolutionNumber: row.resolutionNumber ?? undefined,
            prefix: row.prefix,
            rangeStart: row.rangeStart,
            rangeEnd: row.rangeEnd,
            currentNumber: row.currentNumber,
            startDate: row.startDate ?? undefined,
            endDate: row.endDate ?? undefined,
            technicalKey: row.technicalKey ?? undefined,
            isActive: row.isActive,
            organizationId: row.organizationId,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
        return InvoiceResolution.create(props, row.id);
    }
}

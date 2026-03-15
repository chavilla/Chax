import { injectable } from 'tsyringe';
import {
    IInvoiceItemTaxRepository,
    InvoiceItemTaxToPersist,
} from '../domain/repositories/IInvoiceItemTaxRepository';
import { InvoiceItemTax } from '../domain/entities/InvoiceItemTax';
import { prisma } from '../../../infrastructure/database/prisma';

type PrismaInvoiceItemTax = NonNullable<
    Awaited<ReturnType<typeof prisma.invoiceItemTax.findUnique>>
>;

@injectable()
export class PrismaInvoiceItemTaxRepository implements IInvoiceItemTaxRepository {
    async create(data: InvoiceItemTaxToPersist): Promise<InvoiceItemTax> {
        const row = await prisma.invoiceItemTax.create({
            data: {
                invoiceItemId: data.invoiceItemId,
                dianCode: data.dianCode,
                taxBase: data.taxBase,
                taxPercentage: data.taxPercentage,
                taxAmount: data.taxAmount,
            },
        });
        return this.mapToDomain(row);
    }

    async createMany(list: InvoiceItemTaxToPersist[]): Promise<void> {
        if (list.length === 0) return;
        await prisma.invoiceItemTax.createMany({
            data: list.map((d) => ({
                invoiceItemId: d.invoiceItemId,
                dianCode: d.dianCode,
                taxBase: d.taxBase,
                taxPercentage: d.taxPercentage,
                taxAmount: d.taxAmount,
            })),
        });
    }

    async findById(id: string): Promise<InvoiceItemTax | null> {
        const row = await prisma.invoiceItemTax.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.mapToDomain(row);
    }

    async findByInvoiceItemId(invoiceItemId: string): Promise<InvoiceItemTax[]> {
        const list = await prisma.invoiceItemTax.findMany({
            where: { invoiceItemId },
            orderBy: { createdAt: 'asc' },
        });
        return list.map((r: PrismaInvoiceItemTax) => this.mapToDomain(r));
    }

    async delete(id: string): Promise<void> {
        await prisma.invoiceItemTax.delete({
            where: { id },
        });
    }

    async deleteByInvoiceItemId(invoiceItemId: string): Promise<void> {
        await prisma.invoiceItemTax.deleteMany({
            where: { invoiceItemId },
        });
    }

    private mapToDomain(row: PrismaInvoiceItemTax): InvoiceItemTax {
        return InvoiceItemTax.create(
            {
                invoiceItemId: row.invoiceItemId,
                dianCode: row.dianCode,
                taxBase: Number(row.taxBase),
                taxPercentage: Number(row.taxPercentage),
                taxAmount: Number(row.taxAmount),
                createdAt: row.createdAt,
            },
            row.id
        );
    }
}

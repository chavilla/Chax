import { injectable } from 'tsyringe';
import { IInvoiceRepository, InvoiceItemToPersist, InvoiceItemWithId, CreateInvoiceData } from '../domain/repositories/IInvoiceRepository';
import { Invoice, InvoiceProps } from '../domain/entities/Invoice';
import { prisma } from '../../../infrastructure/database/prisma';
import { Invoice as PrismaInvoice, PaymentMethod } from '@prisma/client';

@injectable()
export class PrismaInvoiceRepository implements IInvoiceRepository {
    async createWithItemsAndStock(data: CreateInvoiceData): Promise<Invoice> {
        const invoice = data.invoice;

        await prisma.$transaction(async (tx) => {
            if (data.resolutionUpdate) {
                await tx.invoiceResolution.update({
                    where: { id: data.resolutionUpdate.resolutionId },
                    data: { currentNumber: data.resolutionUpdate.newCurrentNumber },
                });
            }

            const created = await tx.invoice.create({
                data: {
                    id: invoice.id,
                    type: invoice.props.type,
                    invoiceNumber: invoice.props.invoiceNumber,
                    issueDate: invoice.props.issueDate,
                    dueDate: invoice.props.dueDate ?? null,
                    subtotal: invoice.props.subtotal,
                    taxTotal: invoice.props.taxTotal,
                    discountTotal: invoice.props.discountTotal,
                    total: invoice.props.total,
                    dianStatus: invoice.props.dianStatus,
                    paymentStatus: invoice.props.paymentStatus,
                    customerId: invoice.props.customerId,
                    resolutionId: invoice.props.resolutionId ?? null,
                    createdByUserId: invoice.props.createdByUserId,
                    cashSessionId: invoice.props.cashSessionId ?? null,
                    organizationId: invoice.props.organizationId,
                    parentInvoiceId: invoice.props.parentInvoiceId ?? null,
                    notes: invoice.props.notes ?? null,
                    cufe: invoice.props.cufe ?? null,
                    qrData: invoice.props.qrData ?? null,
                    xmlUrl: invoice.props.xmlUrl ?? null,
                    pdfUrl: invoice.props.pdfUrl ?? null,
                },
            });

            if (data.items.length > 0) {
                await tx.invoiceItem.createMany({
                    data: data.items.map((item) => ({
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount,
                        taxPercentage: item.taxPercentage,
                        taxAmount: item.taxAmount,
                        subtotal: item.subtotal,
                        total: item.total,
                        taxDianCode: item.taxDianCode ?? null,
                        productId: item.productId,
                        invoiceId: created.id,
                    })),
                });
            }

            for (const update of data.productStockUpdates) {
                await tx.product.update({
                    where: { id: update.productId },
                    data: { stock: update.newStock },
                });
            }

            for (const mov of data.stockMovements) {
                await tx.stockMovement.create({
                    data: {
                        type: 'VENTA',
                        quantity: mov.quantity,
                        previousStock: mov.previousStock,
                        newStock: mov.newStock,
                        productId: mov.productId,
                        organizationId: mov.organizationId,
                    },
                });
            }

            if (data.payments?.length) {
                for (const p of data.payments) {
                    await tx.payment.create({
                        data: {
                            invoiceId: created.id,
                            amount: p.amount,
                            paymentMethod: p.paymentMethod as PaymentMethod,
                            reference: p.reference ?? null,
                        },
                    });
                }
            }
        });

        return invoice;
    }

    async findById(id: string): Promise<Invoice | null> {
        const row = await prisma.invoice.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.mapToDomain(row);
    }

    async findByIdWithItems(id: string): Promise<{ invoice: Invoice; items: InvoiceItemWithId[] } | null> {
        const row = await prisma.invoice.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!row) return null;
        const invoice = this.mapToDomain(row);
        const items: InvoiceItemWithId[] = row.items.map((i) => ({
            id: i.id,
            invoiceId: i.invoiceId,
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: Number(i.unitPrice),
            discount: Number(i.discount),
            taxPercentage: Number(i.taxPercentage),
            taxAmount: Number(i.taxAmount),
            subtotal: Number(i.subtotal),
            total: Number(i.total),
            taxDianCode: i.taxDianCode ?? null,
        }));
        return { invoice, items };
    }

    async findAllByOrganization(organizationId: string): Promise<Invoice[]> {
        const list = await prisma.invoice.findMany({
            where: { organizationId },
            orderBy: { issueDate: 'desc' },
        });
        return list.map((r) => this.mapToDomain(r));
    }

    async updatePaymentStatus(invoiceId: string, paymentStatus: string): Promise<void> {
        await prisma.invoice.update({
            where: { id: invoiceId },
            data: { paymentStatus: paymentStatus as 'PENDIENTE' | 'PARCIAL' | 'PAGADA' | 'ANULADA' },
        });
    }

    private mapToDomain(row: PrismaInvoice): Invoice {
        const props: InvoiceProps = {
            type: row.type as InvoiceProps['type'],
            invoiceNumber: row.invoiceNumber,
            issueDate: row.issueDate,
            dueDate: row.dueDate ?? undefined,
            subtotal: Number(row.subtotal),
            taxTotal: Number(row.taxTotal),
            discountTotal: Number(row.discountTotal),
            total: Number(row.total),
            dianStatus: row.dianStatus as InvoiceProps['dianStatus'],
            paymentStatus: row.paymentStatus as InvoiceProps['paymentStatus'],
            customerId: row.customerId,
            resolutionId: row.resolutionId ?? undefined,
            createdByUserId: row.createdByUserId,
            cashSessionId: row.cashSessionId ?? undefined,
            organizationId: row.organizationId,
            parentInvoiceId: row.parentInvoiceId ?? undefined,
            notes: row.notes ?? undefined,
            cufe: row.cufe ?? undefined,
            qrData: row.qrData ?? undefined,
            xmlUrl: row.xmlUrl ?? undefined,
            pdfUrl: row.pdfUrl ?? undefined,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
        return Invoice.create(props, row.id);
    }
}

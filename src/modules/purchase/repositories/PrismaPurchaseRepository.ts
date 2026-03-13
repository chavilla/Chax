import { injectable } from 'tsyringe';
import {
    IPurchaseRepository,
    PurchaseItemToPersist,
    PurchaseItemWithId,
    CreatePurchaseData,
} from '../domain/repositories/IPurchaseRepository';
import { Purchase, PurchaseProps } from '../domain/entities/Purchase';
import { prisma } from '../../../infrastructure/database/prisma';
import { Purchase as PrismaPurchase } from '@prisma/client';

@injectable()
export class PrismaPurchaseRepository implements IPurchaseRepository {
    async createWithItemsAndStock(data: CreatePurchaseData): Promise<Purchase> {
        const purchase = data.purchase;

        await prisma.$transaction(async (tx) => {
            const created = await tx.purchase.create({
                data: {
                    id: purchase.id,
                    supplierId: purchase.props.supplierId,
                    organizationId: purchase.props.organizationId,
                    purchaseDate: purchase.props.purchaseDate,
                    reference: purchase.props.reference ?? null,
                    notes: purchase.props.notes ?? null,
                    total: purchase.props.total,
                },
            });

            if (data.items.length > 0) {
                await tx.purchaseItem.createMany({
                    data: data.items.map((item) => ({
                        quantity: item.quantity,
                        unitCost: item.unitCost,
                        subtotal: item.subtotal,
                        productId: item.productId,
                        purchaseId: created.id,
                    })),
                });
            }

            for (const update of data.productStockUpdates) {
                await tx.product.update({
                    where: { id: update.productId },
                    data: { stock: update.newStock, costPrice: update.newCostPrice },
                });
            }

            for (const mov of data.stockMovements) {
                await tx.stockMovement.create({
                    data: {
                        type: 'COMPRA',
                        quantity: mov.quantity,
                        previousStock: mov.previousStock,
                        newStock: mov.newStock,
                        unitCost: Number(mov.unitCost),
                        productId: mov.productId,
                        supplierId: mov.supplierId,
                        organizationId: mov.organizationId,
                        reference: mov.reference ?? null,
                    },
                });
            }
        });

        return purchase;
    }

    async findById(id: string): Promise<Purchase | null> {
        const row = await prisma.purchase.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.mapToDomain(row);
    }

    async findByIdWithItems(id: string): Promise<{ purchase: Purchase; items: PurchaseItemWithId[] } | null> {
        const row = await prisma.purchase.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!row) return null;
        const purchase = this.mapToDomain(row);
        const items: PurchaseItemWithId[] = row.items.map((i) => ({
            id: i.id,
            purchaseId: i.purchaseId,
            productId: i.productId,
            quantity: i.quantity,
            unitCost: Number(i.unitCost),
            subtotal: Number(i.subtotal),
        }));
        return { purchase, items };
    }

    async findAllByOrganization(organizationId: string): Promise<Purchase[]> {
        const list = await prisma.purchase.findMany({
            where: { organizationId },
            orderBy: { purchaseDate: 'desc' },
        });
        return list.map((r) => this.mapToDomain(r));
    }

    private mapToDomain(row: PrismaPurchase): Purchase {
        const props: PurchaseProps = {
            supplierId: row.supplierId,
            organizationId: row.organizationId,
            purchaseDate: row.purchaseDate,
            reference: row.reference ?? null,
            notes: row.notes ?? null,
            total: Number(row.total),
        };
        return Purchase.create(props, row.id);
    }
}

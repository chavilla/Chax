import { injectable } from 'tsyringe';
import {
    IStockMovementRepository,
    KardexRow,
    FindByProductOptions,
} from '../domain/repositories/IStockMovementRepository';
import { prisma } from '../../../infrastructure/database/prisma';

type PrismaStockMovement = Awaited<ReturnType<typeof prisma.stockMovement.findMany>>[number];

@injectable()
export class PrismaStockMovementRepository implements IStockMovementRepository {
    async findByProduct(productId: string, options?: FindByProductOptions): Promise<KardexRow[]> {
        const where: { productId: string; createdAt?: { gte?: Date; lte?: Date } } = { productId };
        if (options?.from ?? options?.to) {
            where.createdAt = {};
            if (options.from) where.createdAt.gte = options.from;
            if (options.to) where.createdAt.lte = options.to;
        }

        const rows = await prisma.stockMovement.findMany({
            where,
            orderBy: { createdAt: 'asc' },
        });

        return rows.map((r: PrismaStockMovement) => ({
            id: r.id,
            type: r.type as KardexRow['type'],
            quantity: r.quantity,
            previousStock: r.previousStock,
            newStock: r.newStock,
            unitCost: r.unitCost != null ? Number(r.unitCost) : null,
            reason: r.reason ?? null,
            reference: r.reference ?? null,
            productId: r.productId,
            supplierId: r.supplierId ?? null,
            organizationId: r.organizationId,
            createdAt: r.createdAt,
        }));
    }
}

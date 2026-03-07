import { injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { Product, ProductProps } from '../domain/entities/Product';
import { prisma } from '../../../infrastructure/database/prisma';
import { Product as PrismaProduct } from '@prisma/client';

@injectable()
export class PrismaProductRepository implements IProductRepository {
    async getNextSequenceForPrefix(organizationId: string, prefix: string): Promise<number> {
        const prefixWithDash = `${prefix}-`;
        const products = await prisma.product.findMany({
            where: {
                organizationId,
                internalCode: { startsWith: prefixWithDash },
            },
            select: { internalCode: true },
        });

        const numbers = products
            .map((p) => {
                const part = p.internalCode.slice(prefixWithDash.length);
                const num = parseInt(part, 10);
                return Number.isNaN(num) ? 0 : num;
            })
            .filter((n) => n >= 0);

        const max = numbers.length > 0 ? Math.max(...numbers) : 0;
        return max + 1;
    }

    async existsByInternalCodeAndOrganization(
        organizationId: string,
        internalCode: string,
        excludeId?: string
    ): Promise<boolean> {
        const existing = await prisma.product.findFirst({
            where: {
                organizationId,
                internalCode,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }

    async existsByBarcodeAndOrganization(
        organizationId: string,
        barcode: string,
        excludeId?: string
    ): Promise<boolean> {
        const existing = await prisma.product.findFirst({
            where: {
                organizationId,
                barcode,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }

    async existsByNameAndOrganization(
        organizationId: string,
        name: string,
        excludeId?: string
    ): Promise<boolean> {
        const existing = await prisma.product.findFirst({
            where: {
                organizationId,
                name,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }

    async save(product: Product): Promise<void> {
        const data = {
            id: product.id,
            internalCode: product.props.internalCode,
            barcode: product.props.barcode ?? null,
            name: product.props.name,
            description: product.props.description ?? null,
            salePrice: product.props.salePrice,
            costPrice: product.props.costPrice,
            unitOfMeasure: product.props.unitOfMeasure,
            taxType: product.props.taxType,
            taxPercentage: product.props.taxPercentage,
            stock: product.props.stock,
            minStock: product.props.minStock,
            isActive: product.props.isActive,
            categoryId: product.props.categoryId ?? null,
            organizationId: product.props.organizationId,
        };

        await prisma.product.upsert({
            where: { id: product.id },
            update: data,
            create: data,
        });
    }

    async findById(id: string): Promise<Product | null> {
        const prismaProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!prismaProduct) return null;
        return this.mapToDomain(prismaProduct);
    }

    async findAllByOrganization(organizationId: string): Promise<Product[]> {
        const list = await prisma.product.findMany({
            where: { organizationId },
            orderBy: { name: 'asc' },
        });
        return list.map((p) => this.mapToDomain(p));
    }

    async countDependencies(productId: string): Promise<{ invoiceItems: number; stockMovements: number }> {
        const [invoiceItems, stockMovements] = await Promise.all([
            prisma.invoiceItem.count({ where: { productId } }),
            prisma.stockMovement.count({ where: { productId } }),
        ]);
        return { invoiceItems, stockMovements };
    }

    async delete(id: string): Promise<void> {
        await prisma.product.delete({
            where: { id },
        });
    }

    private mapToDomain(prismaProduct: PrismaProduct): Product {
        const props: ProductProps = {
            internalCode: prismaProduct.internalCode,
            barcode: prismaProduct.barcode ?? undefined,
            name: prismaProduct.name,
            description: prismaProduct.description ?? undefined,
            salePrice: Number(prismaProduct.salePrice),
            costPrice: Number(prismaProduct.costPrice),
            unitOfMeasure: prismaProduct.unitOfMeasure,
            taxType: prismaProduct.taxType,
            taxPercentage: Number(prismaProduct.taxPercentage),
            stock: prismaProduct.stock,
            minStock: prismaProduct.minStock,
            isActive: prismaProduct.isActive,
            categoryId: prismaProduct.categoryId ?? undefined,
            organizationId: prismaProduct.organizationId,
            createdAt: prismaProduct.createdAt,
            updatedAt: prismaProduct.updatedAt,
        };

        return Product.create(props, prismaProduct.id);
    }
}

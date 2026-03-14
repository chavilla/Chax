import { injectable } from 'tsyringe';
import { IProductTaxRepository } from '../domain/repositories/IProductTaxRepository';
import { ProductTax, ProductTaxProps } from '../domain/entities/ProductTax';
import { prisma } from '../../../infrastructure/database/prisma';

type PrismaProductTax = NonNullable<Awaited<ReturnType<typeof prisma.productTax.findUnique>>>;

@injectable()
export class PrismaProductTaxRepository implements IProductTaxRepository {
    async save(productTax: ProductTax): Promise<void> {
        await prisma.productTax.upsert({
            where: { id: productTax.id },
            update: {
                taxType: productTax.props.taxType,
                percentage: productTax.props.percentage,
                fixedAmount: productTax.props.fixedAmount ?? null,
            },
            create: {
                id: productTax.id,
                productId: productTax.props.productId,
                taxType: productTax.props.taxType,
                percentage: productTax.props.percentage,
                fixedAmount: productTax.props.fixedAmount ?? null,
            },
        });
    }

    async findById(id: string): Promise<ProductTax | null> {
        const row = await prisma.productTax.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.mapToDomain(row);
    }

    async findByProductId(productId: string): Promise<ProductTax[]> {
        const list = await prisma.productTax.findMany({
            where: { productId },
            orderBy: { createdAt: 'asc' },
        });
        return list.map((r: PrismaProductTax) => this.mapToDomain(r));
    }

    async update(productTax: ProductTax): Promise<void> {
        await prisma.productTax.update({
            where: { id: productTax.id },
            data: {
                taxType: productTax.props.taxType,
                percentage: productTax.props.percentage,
                fixedAmount: productTax.props.fixedAmount ?? null,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.productTax.delete({
            where: { id },
        });
    }

    private mapToDomain(row: PrismaProductTax): ProductTax {
        const props: ProductTaxProps = {
            productId: row.productId,
            taxType: row.taxType as ProductTaxProps['taxType'],
            percentage: Number(row.percentage),
            fixedAmount: row.fixedAmount != null ? Number(row.fixedAmount) : null,
            createdAt: row.createdAt,
        };
        return ProductTax.create(props, row.id);
    }
}

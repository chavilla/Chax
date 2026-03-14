import { injectable } from 'tsyringe';
import { ICategoryRepository } from '../domain/repositories/ICategoryRepository';
import { Category, CategoryProps } from '../domain/entities/Category';
import { prisma } from '../../../infrastructure/database/prisma';

type PrismaCategory = NonNullable<Awaited<ReturnType<typeof prisma.category.findUnique>>>;

@injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
    async existsByNameAndOrganization(
        organizationId: string,
        name: string,
        excludeId?: string
    ): Promise<boolean> {
        const existing = await prisma.category.findFirst({
            where: {
                organizationId,
                name,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }

    async save(category: Category): Promise<void> {
        const data = {
            id: category.id,
            name: category.props.name,
            description: category.props.description ?? null,
            organizationId: category.props.organizationId,
        };

        await prisma.category.upsert({
            where: { id: category.id },
            update: data,
            create: data,
        });
    }

    async findById(id: string): Promise<Category | null> {
        const prismaCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!prismaCategory) return null;
        return this.mapToDomain(prismaCategory);
    }

    async findAllByOrganization(organizationId: string): Promise<Category[]> {
        const list = await prisma.category.findMany({
            where: { organizationId },
            orderBy: { name: 'asc' },
        });
        return list.map((c: PrismaCategory) => this.mapToDomain(c));
    }

    private mapToDomain(prismaCategory: PrismaCategory): Category {
        const props: CategoryProps = {
            name: prismaCategory.name,
            description: prismaCategory.description ?? undefined,
            organizationId: prismaCategory.organizationId,
            createdAt: prismaCategory.createdAt,
            updatedAt: prismaCategory.updatedAt,
        };

        return Category.create(props, prismaCategory.id);
    }
}

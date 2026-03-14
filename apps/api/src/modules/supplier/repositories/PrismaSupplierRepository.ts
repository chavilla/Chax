import { injectable } from 'tsyringe';
import { ISupplierRepository } from '../domain/repositories/ISupplierRepository';
import { Supplier, SupplierProps } from '../domain/entities/Supplier';
import { prisma } from '../../../infrastructure/database/prisma';

type PrismaSupplier = NonNullable<Awaited<ReturnType<typeof prisma.supplier.findUnique>>>;

@injectable()
export class PrismaSupplierRepository implements ISupplierRepository {
    async existsByIdNumberAndOrganization(
        organizationId: string,
        idNumber: string,
        excludeId?: string
    ): Promise<boolean> {
        const existing = await prisma.supplier.findFirst({
            where: {
                organizationId,
                idNumber,
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
        const existing = await prisma.supplier.findFirst({
            where: {
                organizationId,
                name,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }

    async existsByContactNameAndOrganization(
        organizationId: string,
        contactName: string,
        excludeId?: string
    ): Promise<boolean> {
        const existing = await prisma.supplier.findFirst({
            where: {
                organizationId,
                contactName,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }

    async save(supplier: Supplier): Promise<void> {
        const data = {
            id: supplier.id,
            idType: supplier.props.idType,
            idNumber: supplier.props.idNumber,
            name: supplier.props.name,
            contactName: supplier.props.contactName ?? null,
            email: supplier.props.email ?? null,
            phone: supplier.props.phone ?? null,
            address: supplier.props.address ?? null,
            city: supplier.props.city ?? null,
            department: supplier.props.department ?? null,
            notes: supplier.props.notes ?? null,
            organizationId: supplier.props.organizationId,
        };

        await prisma.supplier.upsert({
            where: { id: supplier.id },
            update: data,
            create: data,
        });
    }

    async findById(id: string): Promise<Supplier | null> {
        const prismaSupplier = await prisma.supplier.findUnique({
            where: { id },
        });
        if (!prismaSupplier) return null;
        return this.mapToDomain(prismaSupplier);
    }

    async findAllByOrganization(organizationId: string): Promise<Supplier[]> {
        const list = await prisma.supplier.findMany({
            where: { organizationId },
            orderBy: { name: 'asc' },
        });
        return list.map((s: PrismaSupplier) => this.mapToDomain(s));
    }

    async findAll(): Promise<Supplier[]> {
        const list = await prisma.supplier.findMany({
            orderBy: { name: 'asc' },
        });
        return list.map((s: PrismaSupplier) => this.mapToDomain(s));
    }

    private mapToDomain(prismaSupplier: PrismaSupplier): Supplier {
        const props: SupplierProps = {
            idType: prismaSupplier.idType as SupplierProps['idType'],
            idNumber: prismaSupplier.idNumber,
            name: prismaSupplier.name,
            contactName: prismaSupplier.contactName ?? undefined,
            email: prismaSupplier.email ?? undefined,
            phone: prismaSupplier.phone ?? undefined,
            address: prismaSupplier.address ?? undefined,
            city: prismaSupplier.city ?? undefined,
            department: prismaSupplier.department ?? undefined,
            notes: prismaSupplier.notes ?? undefined,
            organizationId: prismaSupplier.organizationId,
            createdAt: prismaSupplier.createdAt,
            updatedAt: prismaSupplier.updatedAt,
        };
        return Supplier.create(props, prismaSupplier.id);
    }
}

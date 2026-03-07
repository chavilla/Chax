import { injectable } from 'tsyringe';
import { ICustomerRepository } from '../domain/repositories/ICustomerRepository';
import { Customer, CustomerProps } from '../domain/entities/Customer';
import { prisma } from '../../../infrastructure/database/prisma';
import { Customer as PrismaCustomer } from '@prisma/client';

@injectable()
export class PrismaCustomerRepository implements ICustomerRepository {
    async existsByIdTypeAndIdNumberAndOrganization(
        organizationId: string,
        idType: string,
        idNumber: string,
        excludeId?: string
    ): Promise<boolean> {
        const existing = await prisma.customer.findFirst({
            where: {
                organizationId,
                idType: idType as import('@prisma/client').IdType,
                idNumber,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }

    async save(customer: Customer): Promise<void> {
        const data = {
            id: customer.id,
            idType: customer.props.idType,
            idNumber: customer.props.idNumber,
            dv: customer.props.dv ?? null,
            name: customer.props.name,
            email: customer.props.email ?? null,
            phone: customer.props.phone ?? null,
            address: customer.props.address ?? null,
            city: customer.props.city ?? null,
            department: customer.props.department ?? null,
            taxRegime: customer.props.taxRegime,
            fiscalResponsibilities: customer.props.fiscalResponsibilities ?? null,
            organizationId: customer.props.organizationId,
        };

        await prisma.customer.upsert({
            where: { id: customer.id },
            update: data,
            create: data,
        });
    }

    async findById(id: string): Promise<Customer | null> {
        const prismaCustomer = await prisma.customer.findUnique({
            where: { id },
        });

        if (!prismaCustomer) return null;
        return this.mapToDomain(prismaCustomer);
    }

    async findAllByOrganization(organizationId: string): Promise<Customer[]> {
        const list = await prisma.customer.findMany({
            where: { organizationId },
            orderBy: { name: 'asc' },
        });
        return list.map((c) => this.mapToDomain(c));
    }

    async findAll(): Promise<Customer[]> {
        const list = await prisma.customer.findMany({
            orderBy: { name: 'asc' },
        });
        return list.map((c) => this.mapToDomain(c));
    }

    private mapToDomain(prismaCustomer: PrismaCustomer): Customer {
        const props: CustomerProps = {
            idType: prismaCustomer.idType,
            idNumber: prismaCustomer.idNumber,
            dv: prismaCustomer.dv ?? undefined,
            name: prismaCustomer.name,
            email: prismaCustomer.email ?? undefined,
            phone: prismaCustomer.phone ?? undefined,
            address: prismaCustomer.address ?? undefined,
            city: prismaCustomer.city ?? undefined,
            department: prismaCustomer.department ?? undefined,
            taxRegime: prismaCustomer.taxRegime,
            fiscalResponsibilities: prismaCustomer.fiscalResponsibilities ?? undefined,
            organizationId: prismaCustomer.organizationId,
            createdAt: prismaCustomer.createdAt,
            updatedAt: prismaCustomer.updatedAt,
        };

        return Customer.create(props, prismaCustomer.id);
    }
}

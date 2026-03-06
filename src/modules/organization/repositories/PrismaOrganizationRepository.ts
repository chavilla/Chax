import { injectable } from 'tsyringe';
import { IOrganizationRepository } from '../domain/repositories/IOrganizationRepository';
import { Organization, OrganizationProps } from '../domain/entities/Organization';
import { prisma } from '../../../infrastructure/database/prisma';
import { Organization as PrismaOrganization } from '@prisma/client';

@injectable()
export class PrismaOrganizationRepository implements IOrganizationRepository {
    async exists(nit: string): Promise<boolean> {
        const organization = await prisma.organization.findUnique({
            where: { nit },
        });
        return !!organization;
    }

    async save(organization: Organization): Promise<void> {
        const data = {
            id: organization.id,
            nit: organization.props.nit,
            dv: organization.props.dv,
            businessName: organization.props.businessName,
            tradeName: organization.props.tradeName,
            address: organization.props.address,
            city: organization.props.city,
            department: organization.props.department,
            phone: organization.props.phone,
            email: organization.props.email,
            economicActivityCode: organization.props.economicActivityCode,
            taxRegime: organization.props.taxRegime,
            usesDian: organization.props.usesDian,
            logoUrl: organization.props.logoUrl,
        };

        await prisma.organization.upsert({
            where: { id: organization.id },
            update: data,
            create: data,
        });
    }

    async findById(id: string): Promise<Organization | null> {
        const prismaOrg = await prisma.organization.findUnique({
            where: { id },
        });

        if (!prismaOrg) return null;
        return this.mapToDomain(prismaOrg);
    }

    async findByNit(nit: string): Promise<Organization | null> {
        const prismaOrg = await prisma.organization.findUnique({
            where: { nit },
        });

        if (!prismaOrg) return null;
        return this.mapToDomain(prismaOrg);
    }

    private mapToDomain(prismaOrg: PrismaOrganization): Organization {
        const props: OrganizationProps = {
            nit: prismaOrg.nit,
            dv: prismaOrg.dv || undefined,
            businessName: prismaOrg.businessName,
            tradeName: prismaOrg.tradeName || undefined,
            address: prismaOrg.address,
            city: prismaOrg.city,
            department: prismaOrg.department,
            phone: prismaOrg.phone || undefined,
            email: prismaOrg.email,
            economicActivityCode: prismaOrg.economicActivityCode || undefined,
            taxRegime: prismaOrg.taxRegime,
            usesDian: prismaOrg.usesDian,
            logoUrl: prismaOrg.logoUrl || undefined,
            createdAt: prismaOrg.createdAt,
            updatedAt: prismaOrg.updatedAt,
        };

        return Organization.create(props, prismaOrg.id);
    }
}

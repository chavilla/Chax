import { Entity } from '../../../../shared/core/Entity';
import { TaxRegime } from '@prisma/client';

export interface OrganizationProps {
    nit: string;
    dv?: string;
    businessName: string;
    tradeName?: string;
    address: string;
    city: string;
    department: string;
    phone?: string;
    email: string;
    economicActivityCode?: string;
    taxRegime: TaxRegime;
    usesDian: boolean;
    logoUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Organization extends Entity<OrganizationProps> {
    private constructor(props: OrganizationProps, id?: string) {
        super(props, id);
    }

    public static create(props: OrganizationProps, id?: string): Organization {
        // Here we can add domain validations that must always be true for an Organization
        if (!props.nit || props.nit.trim().length === 0) {
            throw new Error('Organization must have a valid NIT');
        }

        if (!props.businessName || props.businessName.trim().length === 0) {
            throw new Error('Organization must have a business name');
        }

        const organization = new Organization(
            {
                ...props,
                taxRegime: props.taxRegime || TaxRegime.NO_RESPONSABLE_IVA,
                usesDian: props.usesDian || false,
            },
            id
        );

        return organization;
    }
}

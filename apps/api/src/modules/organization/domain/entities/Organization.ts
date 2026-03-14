import { Entity } from '../../../../shared/core/Entity';
import { TaxRegime, type OrganizationProps } from '@chax/shared';

export type { OrganizationProps } from '@chax/shared';

export class Organization extends Entity<OrganizationProps> {
    private constructor(props: OrganizationProps, id?: string) {
        super(props, id);
    }

    public static create(props: OrganizationProps, id?: string): Organization {
        if (!props.nit || props.nit.trim().length === 0) {
            throw new Error('Organization must have a valid NIT');
        }
        if (!props.businessName || props.businessName.trim().length === 0) {
            throw new Error('Organization must have a business name');
        }
        return new Organization(
            {
                ...props,
                taxRegime: props.taxRegime || TaxRegime.NO_RESPONSABLE_IVA,
                usesDian: props.usesDian ?? false,
            },
            id
        );
    }
}

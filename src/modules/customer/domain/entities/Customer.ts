import { Entity } from '../../../../shared/core/Entity';
import { IdType, TaxRegime } from '@prisma/client';

export interface CustomerProps {
    idType: IdType;
    idNumber: string;
    dv?: string | null;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    department?: string | null;
    taxRegime: TaxRegime;
    fiscalResponsibilities?: string | null;
    organizationId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Customer extends Entity<CustomerProps> {
    private constructor(props: CustomerProps, id?: string) {
        super(props, id);
    }

    public static create(props: CustomerProps, id?: string): Customer {
        const trimmedId = props.idNumber?.trim() ?? '';
        if (trimmedId.length === 0) {
            throw new Error('El cliente debe tener un número de documento');
        }
        if (trimmedId.length < 5 || trimmedId.length > 20) {
            throw new Error('El número de documento debe tener entre 5 y 20 caracteres');
        }

        const trimmedName = props.name?.trim() ?? '';
        if (trimmedName.length === 0) {
            throw new Error('El cliente debe tener un nombre');
        }
        if (trimmedName.length < 5) {
            throw new Error('El nombre debe tener al menos 5 caracteres');
        }
        const nameParts = trimmedName.split(/\s+/).filter(Boolean);
        if (nameParts.length < 2) {
            throw new Error('Debe incluir al menos nombre y apellido');
        }

        if (!props.organizationId || props.organizationId.trim().length === 0) {
            throw new Error('El cliente debe pertenecer a una organización');
        }

        return new Customer(
            {
                ...props,
                idType: props.idType ?? IdType.CC,
                taxRegime: props.taxRegime ?? TaxRegime.NO_RESPONSABLE_IVA,
            },
            id
        );
    }
}

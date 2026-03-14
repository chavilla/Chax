import { Entity } from '../../../../shared/core/Entity';
import { IdType, type SupplierProps } from '@chax/shared';

export type { SupplierProps } from '@chax/shared';

export class Supplier extends Entity<SupplierProps> {
    private constructor(props: SupplierProps, id?: string) {
        super(props, id);
    }

    public static create(props: SupplierProps, id?: string): Supplier {
        const trimmedIdNumber = props.idNumber?.trim() ?? '';
        if (trimmedIdNumber.length === 0) throw new Error('El proveedor debe tener un número de documento');
        if (trimmedIdNumber.length < 5 || trimmedIdNumber.length > 20) {
            throw new Error('El número de documento debe tener entre 5 y 20 caracteres');
        }
        const trimmedName = props.name?.trim() ?? '';
        if (trimmedName.length === 0) throw new Error('El proveedor debe tener razón social');
        if (trimmedName.length < 2) throw new Error('La razón social debe tener al menos 2 caracteres');
        if (props.contactName !== undefined && props.contactName !== null) {
            const trimmedContact = props.contactName.trim();
            if (trimmedContact.length > 0 && trimmedContact.length < 2) {
                throw new Error('El nombre del contacto debe tener al menos 2 caracteres');
            }
        }
        if (!props.organizationId || props.organizationId.trim().length === 0) {
            throw new Error('El proveedor debe pertenecer a una organización');
        }
        return new Supplier(
            {
                ...props,
                idType: props.idType ?? IdType.NIT,
            },
            id
        );
    }
}

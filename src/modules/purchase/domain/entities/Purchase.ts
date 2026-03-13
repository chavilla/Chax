import { Entity } from '../../../../shared/core/Entity';

export interface PurchaseProps {
    supplierId: string;
    organizationId: string;
    purchaseDate: Date;
    reference?: string | null;
    notes?: string | null;
    total: number;
}

export class Purchase extends Entity<PurchaseProps> {
    private constructor(props: PurchaseProps, id?: string) {
        super(props, id);
    }

    public static create(props: PurchaseProps, id?: string): Purchase {
        if (!props.organizationId?.trim()) {
            throw new Error('La compra debe pertenecer a una organización');
        }
        if (!props.supplierId?.trim()) {
            throw new Error('La compra debe tener un proveedor');
        }
        if (props.total < 0) {
            throw new Error('El total de la compra no puede ser negativo');
        }
        return new Purchase(
            {
                ...props,
                purchaseDate: props.purchaseDate ?? new Date(),
            },
            id
        );
    }
}

import { Entity } from '../../../../shared/core/Entity';
import { TaxType, type ProductProps } from '@chax/shared';

export type { ProductProps } from '@chax/shared';

export class Product extends Entity<ProductProps> {
    private constructor(props: ProductProps, id?: string) {
        super(props, id);
    }

    public static create(props: ProductProps, id?: string): Product {
        if (!props.internalCode || props.internalCode.trim().length === 0) {
            throw new Error('El producto debe tener un código interno');
        }
        if (!props.name || props.name.trim().length === 0) {
            throw new Error('El producto debe tener un nombre');
        }
        if (props.salePrice < 0) throw new Error('El precio de venta no puede ser negativo');
        if (props.costPrice < 0) throw new Error('El costo no puede ser negativo');
        if (props.stock < 0 || props.minStock < 0) {
            throw new Error('Stock y stock mínimo no pueden ser negativos');
        }
        if (!props.organizationId || props.organizationId.trim().length === 0) {
            throw new Error('El producto debe pertenecer a una organización');
        }
        return new Product(
            {
                ...props,
                name: props.name.trim().toUpperCase(),
                unitOfMeasure: props.unitOfMeasure ?? '94',
                taxType: props.taxType ?? TaxType.EXCLUIDO,
                taxPercentage: props.taxPercentage ?? 0,
                stock: props.stock ?? 0,
                minStock: props.minStock ?? 0,
                isActive: props.isActive ?? true,
            },
            id
        );
    }
}

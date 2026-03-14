import { Entity } from '../../../../shared/core/Entity';
import type { ProductTaxProps } from '@chax/shared';

export type { ProductTaxProps } from '@chax/shared';

export class ProductTax extends Entity<ProductTaxProps> {
    private constructor(props: ProductTaxProps, id?: string) {
        super(props, id);
    }

    public static create(props: ProductTaxProps, id?: string): ProductTax {
        if (!props.productId?.trim()) {
            throw new Error('El impuesto debe pertenecer a un producto');
        }
        if (props.percentage < 0 || props.percentage > 100) {
            throw new Error('El porcentaje debe estar entre 0 y 100');
        }
        if (props.fixedAmount != null && props.fixedAmount < 0) {
            throw new Error('El monto fijo no puede ser negativo');
        }
        return new ProductTax(props, id);
    }
}

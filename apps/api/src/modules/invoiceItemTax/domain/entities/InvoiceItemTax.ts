import { Entity } from '../../../../shared/core/Entity';
import type { InvoiceItemTaxProps } from '@chax/shared';

export type { InvoiceItemTaxProps } from '@chax/shared';

export class InvoiceItemTax extends Entity<InvoiceItemTaxProps> {
    private constructor(props: InvoiceItemTaxProps, id?: string) {
        super(props, id);
    }

    public static create(props: InvoiceItemTaxProps, id?: string): InvoiceItemTax {
        if (!props.invoiceItemId?.trim()) {
            throw new Error('El desglose debe pertenecer a un ítem de factura');
        }
        if (!props.dianCode?.trim()) {
            throw new Error('El código DIAN es requerido (01=IVA, 02=IC, 03=ICA)');
        }
        if (props.taxBase < 0 || props.taxPercentage < 0 || props.taxPercentage > 100 || props.taxAmount < 0) {
            throw new Error('Base, porcentaje y monto de impuesto deben ser válidos');
        }
        return new InvoiceItemTax(props, id);
    }
}

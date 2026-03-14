import { Entity } from '../../../../shared/core/Entity';
import type { PaymentProps } from '@chax/shared';

export type { PaymentProps } from '@chax/shared';

export class Payment extends Entity<PaymentProps> {
    private constructor(props: PaymentProps, id?: string) {
        super(props, id);
    }

    public static create(props: PaymentProps, id?: string): Payment {
        if (!props.invoiceId?.trim()) throw new Error('El pago debe estar asociado a una factura');
        if (props.amount <= 0) throw new Error('El monto del pago debe ser mayor a 0');
        return new Payment(props, id);
    }
}

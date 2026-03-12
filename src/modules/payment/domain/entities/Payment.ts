import { Entity } from '../../../../shared/core/Entity';

export type PaymentMethod =
    | 'EFECTIVO'
    | 'TARJETA_CREDITO'
    | 'TARJETA_DEBITO'
    | 'TRANSFERENCIA'
    | 'NEQUI'
    | 'DAVIPLATA'
    | 'OTRO';

export interface PaymentProps {
    invoiceId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentDate: Date;
    reference?: string | null;
}

export class Payment extends Entity<PaymentProps> {
    private constructor(props: PaymentProps, id?: string) {
        super(props, id);
    }

    public static create(props: PaymentProps, id?: string): Payment {
        if (!props.invoiceId?.trim()) {
            throw new Error('El pago debe estar asociado a una factura');
        }
        if (props.amount <= 0) {
            throw new Error('El monto del pago debe ser mayor a 0');
        }
        return new Payment(props, id);
    }
}

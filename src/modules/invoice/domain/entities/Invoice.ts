import { Entity } from '../../../../shared/core/Entity';

export type InvoiceType = 'FACTURA' | 'NOTA_CREDITO' | 'NOTA_DEBITO' | 'POS';
export type DianStatus = 'PENDIENTE' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA';
export type PaymentStatus = 'PENDIENTE' | 'PARCIAL' | 'PAGADA' | 'ANULADA';

export interface InvoiceProps {
    type: InvoiceType;
    invoiceNumber: string;
    issueDate: Date;
    dueDate?: Date | null;
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    total: number;
    dianStatus: DianStatus;
    paymentStatus: PaymentStatus;
    customerId: string;
    resolutionId?: string | null;
    createdByUserId: string;
    cashSessionId?: string | null;
    organizationId: string;
    parentInvoiceId?: string | null;
    notes?: string | null;
    cufe?: string | null;
    qrData?: string | null;
    xmlUrl?: string | null;
    pdfUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Invoice extends Entity<InvoiceProps> {
    private constructor(props: InvoiceProps, id?: string) {
        super(props, id);
    }

    public static create(props: InvoiceProps, id?: string): Invoice {
        if (!props.invoiceNumber?.trim()) {
            throw new Error('El número de factura es requerido');
        }
        if (!props.customerId?.trim()) {
            throw new Error('El cliente es requerido');
        }
        if (!props.createdByUserId?.trim()) {
            throw new Error('El usuario que crea la factura es requerido');
        }
        if (!props.organizationId?.trim()) {
            throw new Error('La organización es requerida');
        }
        if (props.subtotal < 0 || props.taxTotal < 0 || props.discountTotal < 0 || props.total < 0) {
            throw new Error('Los totales no pueden ser negativos');
        }
        const expectedTotal = Number((props.subtotal + props.taxTotal - props.discountTotal).toFixed(2));
        const totalRounded = Number(props.total.toFixed(2));
        if (Math.abs(expectedTotal - totalRounded) > 0.02) {
            throw new Error('El total no coincide con subtotal + impuestos - descuentos');
        }
        return new Invoice(props, id);
    }
}

import { Invoice } from '../entities/Invoice';

/** Desglose DIAN por impuesto (opcional al crear ítem). */
export interface InvoiceItemTaxBreakdownToPersist {
    dianCode: string;
    taxBase: number;
    taxPercentage: number;
    taxAmount: number;
}

export interface InvoiceItemToPersist {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxPercentage: number;
    taxAmount: number;
    subtotal: number;
    total: number;
    taxDianCode?: string | null;
    taxBreakdown?: InvoiceItemTaxBreakdownToPersist[];
}

export interface InvoiceItemTaxBreakdownWithId extends InvoiceItemTaxBreakdownToPersist {
    id: string;
}

export interface InvoiceItemWithId extends InvoiceItemToPersist {
    id: string;
    invoiceId: string;
    taxBreakdown?: InvoiceItemTaxBreakdownWithId[];
}

export interface PaymentToPersist {
    amount: number;
    paymentMethod: string;
    reference?: string | null;
}

export interface CreateInvoiceData {
    invoice: Invoice;
    items: InvoiceItemToPersist[];
    resolutionUpdate: { resolutionId: string; newCurrentNumber: number } | null;
    productStockUpdates: { productId: string; newStock: number }[];
    stockMovements: {
        productId: string;
        quantity: number;
        previousStock: number;
        newStock: number;
        unitCost?: number | null;
        organizationId: string;
    }[];
    payments?: PaymentToPersist[];
}

export type InvoicePaymentStatus = 'PENDIENTE' | 'PARCIAL' | 'PAGADA' | 'ANULADA';

export interface IInvoiceRepository {
    createWithItemsAndStock(data: CreateInvoiceData): Promise<Invoice>;
    findById(id: string): Promise<Invoice | null>;
    findByIdWithItems(id: string): Promise<{ invoice: Invoice; items: InvoiceItemWithId[] } | null>;
    findAllByOrganization(organizationId: string): Promise<Invoice[]>;
    updatePaymentStatus(invoiceId: string, paymentStatus: InvoicePaymentStatus): Promise<void>;
}

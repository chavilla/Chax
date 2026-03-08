import { Invoice } from '../entities/Invoice';

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
}

export interface InvoiceItemWithId extends InvoiceItemToPersist {
    id: string;
    invoiceId: string;
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
        organizationId: string;
    }[];
}

export interface IInvoiceRepository {
    createWithItemsAndStock(data: CreateInvoiceData): Promise<Invoice>;
    findById(id: string): Promise<Invoice | null>;
    findByIdWithItems(id: string): Promise<{ invoice: Invoice; items: InvoiceItemWithId[] } | null>;
    findAllByOrganization(organizationId: string): Promise<Invoice[]>;
}

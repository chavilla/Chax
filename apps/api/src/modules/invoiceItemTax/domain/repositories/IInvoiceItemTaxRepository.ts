import { InvoiceItemTax } from '../entities/InvoiceItemTax';

export interface InvoiceItemTaxToPersist {
    invoiceItemId: string;
    dianCode: string;
    taxBase: number;
    taxPercentage: number;
    taxAmount: number;
}

export interface IInvoiceItemTaxRepository {
    create(data: InvoiceItemTaxToPersist): Promise<InvoiceItemTax>;
    createMany(data: InvoiceItemTaxToPersist[]): Promise<void>;
    findById(id: string): Promise<InvoiceItemTax | null>;
    findByInvoiceItemId(invoiceItemId: string): Promise<InvoiceItemTax[]>;
    delete(id: string): Promise<void>;
    deleteByInvoiceItemId(invoiceItemId: string): Promise<void>;
}

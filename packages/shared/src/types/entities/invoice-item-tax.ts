export interface InvoiceItemTaxProps {
  invoiceItemId: string;
  dianCode: string;
  taxBase: number;
  taxPercentage: number;
  taxAmount: number;
  createdAt?: Date;
}

/** Forma de InvoiceItemTax en respuestas API / frontend */
export interface InvoiceItemTax extends InvoiceItemTaxProps {
  id: string;
}

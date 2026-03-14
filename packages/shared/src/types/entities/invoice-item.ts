export interface InvoiceItemProps {
  productId: string;
  invoiceId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxPercentage: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  taxDianCode?: string | null;
}

/** Forma de InvoiceItem en respuestas API / frontend */
export interface InvoiceItem extends InvoiceItemProps {
  id: string;
}

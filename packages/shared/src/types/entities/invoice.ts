import type { InvoiceType, DianStatus, PaymentStatus } from '../../enums';

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

/** Forma de Invoice en respuestas API / frontend */
export interface Invoice extends InvoiceProps {
  id: string;
}

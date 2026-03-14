import type { PaymentMethod } from '../../enums';

export interface PaymentProps {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  reference?: string | null;
}

/** Forma de Payment en respuestas API / frontend */
export interface Payment extends PaymentProps {
  id: string;
}

import { Payment } from '../entities/Payment';

export interface CreatePaymentData {
    invoiceId: string;
    amount: number;
    paymentMethod: string;
    reference?: string | null;
}

export interface IPaymentRepository {
    create(data: CreatePaymentData): Promise<Payment>;
    getTotalPaidByInvoiceId(invoiceId: string): Promise<number>;
}

import { injectable } from 'tsyringe';
import { IPaymentRepository, CreatePaymentData } from '../domain/repositories/IPaymentRepository';
import { Payment, PaymentProps } from '../domain/entities/Payment';
import { prisma } from '../../../infrastructure/database/prisma';
import { PaymentMethod } from '@chax/shared';

@injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
    async create(data: CreatePaymentData): Promise<Payment> {
        const row = await prisma.payment.create({
            data: {
                invoiceId: data.invoiceId,
                amount: data.amount,
                paymentMethod: (data.paymentMethod as PaymentMethod) ?? PaymentMethod.EFECTIVO,
                reference: data.reference ?? null,
            },
        });
        const props: PaymentProps = {
            invoiceId: row.invoiceId,
            amount: Number(row.amount),
            paymentMethod: row.paymentMethod as PaymentProps['paymentMethod'],
            paymentDate: row.paymentDate,
            reference: row.reference ?? null,
        };
        return Payment.create(props, row.id);
    }

    async getTotalPaidByInvoiceId(invoiceId: string): Promise<number> {
        const result = await prisma.payment.aggregate({
            where: { invoiceId },
            _sum: { amount: true },
        });
        return Number(result._sum.amount ?? 0);
    }
}

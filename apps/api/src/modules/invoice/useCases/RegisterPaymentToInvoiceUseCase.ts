import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IInvoiceRepository, InvoicePaymentStatus } from '../domain/repositories/IInvoiceRepository';
import { IPaymentRepository } from '../../payment/domain/repositories/IPaymentRepository';
import { InvoiceRepositoryToken, PaymentRepositoryToken } from '../../../shared/container/tokens';
import { AppError } from '../../../shared/errors/AppError';
import { AuditRecorder } from '../../../shared/audit/AuditRecorder';
import type { Payment } from '../../payment/domain/entities/Payment';
import type { RegisterPaymentDTO } from '../dtos/invoice.dtos';

@injectable()
export class RegisterPaymentToInvoiceUseCase implements UseCase<RegisterPaymentDTO, Payment> {
    constructor(
        @inject(InvoiceRepositoryToken) private readonly invoiceRepository: IInvoiceRepository,
        @inject(PaymentRepositoryToken) private readonly paymentRepository: IPaymentRepository,
        @inject(AuditRecorder) private readonly auditRecorder: AuditRecorder
    ) {}

    async execute(request: RegisterPaymentDTO): Promise<Payment> {
        const { invoiceId, amount, paymentMethod, reference } = request;

        const invoice = await this.invoiceRepository.findById(invoiceId);
        if (!invoice) {
            throw new AppError('Factura no encontrada', 404);
        }

        const payment = await this.paymentRepository.create({
            invoiceId,
            amount,
            paymentMethod: paymentMethod ?? 'EFECTIVO',
            reference: reference ?? null,
        });

        const totalPaid = await this.paymentRepository.getTotalPaidByInvoiceId(invoiceId);
        const invoiceTotal = invoice.props.total;
        const paymentStatus: InvoicePaymentStatus =
            totalPaid >= invoiceTotal ? 'PAGADA' : totalPaid > 0 ? 'PARCIAL' : 'PENDIENTE';

        await this.invoiceRepository.updatePaymentStatus(invoiceId, paymentStatus);
        const orgId = invoice.props.organizationId;
        await this.auditRecorder.recordIfUser(request.performedByUserId, {
            action: 'CREATE',
            entity: 'Payment',
            entityId: payment.id,
            newValues: { invoiceId, amount, paymentMethod: payment.props.paymentMethod, organizationId: orgId },
            organizationId: orgId,
        });
        return payment;
    }
}

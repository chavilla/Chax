import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateInvoiceUseCase } from '../useCases/CreateInvoiceUseCase';
import { GetInvoiceUseCase } from '../useCases/GetInvoiceUseCase';
import { GetInvoicesUseCase } from '../useCases/GetInvoicesUseCase';
import { RegisterPaymentToInvoiceUseCase } from '../useCases/RegisterPaymentToInvoiceUseCase';
import type { InvoiceItemWithId } from '../domain/repositories/IInvoiceRepository';
import type { Invoice } from '../domain/entities/Invoice';
import { getOrganizationIdFromRequest, getAuthContext } from '../../../shared/auth/getAuthContext';

@injectable()
export class InvoiceController {
    constructor(
        private readonly createInvoiceUseCase: CreateInvoiceUseCase,
        private readonly getInvoiceUseCase: GetInvoiceUseCase,
        private readonly getInvoicesUseCase: GetInvoicesUseCase,
        private readonly registerPaymentToInvoiceUseCase: RegisterPaymentToInvoiceUseCase
    ) {}

    private invoiceToResponse(invoice: Invoice) {
        return {
            id: invoice.id,
            type: invoice.props.type,
            invoiceNumber: invoice.props.invoiceNumber,
            issueDate: invoice.props.issueDate,
            dueDate: invoice.props.dueDate ?? null,
            subtotal: invoice.props.subtotal,
            taxTotal: invoice.props.taxTotal,
            discountTotal: invoice.props.discountTotal,
            total: invoice.props.total,
            dianStatus: invoice.props.dianStatus,
            paymentStatus: invoice.props.paymentStatus,
            customerId: invoice.props.customerId,
            resolutionId: invoice.props.resolutionId ?? null,
            createdByUserId: invoice.props.createdByUserId,
            cashSessionId: invoice.props.cashSessionId ?? null,
            organizationId: invoice.props.organizationId,
            notes: invoice.props.notes ?? null,
        };
    }

    private itemToResponse(item: InvoiceItemWithId) {
        return {
            id: item.id,
            invoiceId: item.invoiceId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            taxPercentage: item.taxPercentage,
            taxAmount: item.taxAmount,
            subtotal: item.subtotal,
            total: item.total,
            taxDianCode: item.taxDianCode ?? null,
            taxBreakdown: item.taxBreakdown ?? undefined,
        };
    }

    async create(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const { invoice, warning } = await this.createInvoiceUseCase.execute({
            ...request.body,
            organizationId: ctx.organizationId,
            createdByUserId: ctx.userId,
        });
        const body = this.invoiceToResponse(invoice);
        return response.status(201).json(warning ? { ...body, warning } : body);
    }

    async getById(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const { invoice, items } = await this.getInvoiceUseCase.execute(id);
        return response.status(200).json({
            ...this.invoiceToResponse(invoice),
            items: items.map((i) => this.itemToResponse(i)),
        });
    }

    async getInvoices(request: Request, response: Response): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const invoices = await this.getInvoicesUseCase.execute(organizationId);
        return response.status(200).json(invoices.map((inv) => this.invoiceToResponse(inv)));
    }

    async addPayment(request: Request, response: Response): Promise<Response> {
        const invoiceId = request.params.id as string;
        const performedByUserId = request.user?.id ?? undefined;
        const payment = await this.registerPaymentToInvoiceUseCase.execute({
            invoiceId,
            ...request.body,
            performedByUserId,
        });
        return response.status(201).json({
            id: payment.id,
            invoiceId: payment.props.invoiceId,
            amount: payment.props.amount,
            paymentMethod: payment.props.paymentMethod,
            paymentDate: payment.props.paymentDate,
            reference: payment.props.reference ?? null,
        });
    }
}

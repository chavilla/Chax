import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateInvoiceUseCase } from '../useCases/CreateInvoiceUseCase';
import { GetInvoiceUseCase } from '../useCases/GetInvoiceUseCase';
import { GetInvoicesUseCase } from '../useCases/GetInvoicesUseCase';
import { AppError } from '../../../shared/errors/AppError';
import type { InvoiceItemWithId } from '../domain/repositories/IInvoiceRepository';
import type { Invoice } from '../domain/entities/Invoice';

@injectable()
export class InvoiceController {
    constructor(
        private readonly createInvoiceUseCase: CreateInvoiceUseCase,
        private readonly getInvoiceUseCase: GetInvoiceUseCase,
        private readonly getInvoicesUseCase: GetInvoicesUseCase
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
        };
    }

    async create(request: Request, response: Response): Promise<Response> {
        try {
            const { invoice, warning } = await this.createInvoiceUseCase.execute(request.body);
            const body = this.invoiceToResponse(invoice);
            return response.status(201).json(warning ? { ...body, warning } : body);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async getById(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            const { invoice, items } = await this.getInvoiceUseCase.execute(id);
            return response.status(200).json({
                ...this.invoiceToResponse(invoice),
                items: items.map((i) => this.itemToResponse(i)),
            });
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async getInvoices(request: Request, response: Response): Promise<Response> {
        try {
            const organizationId = request.query.organizationId as string;
            const invoices = await this.getInvoicesUseCase.execute(organizationId);
            return response.status(200).json(invoices.map((inv) => this.invoiceToResponse(inv)));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}

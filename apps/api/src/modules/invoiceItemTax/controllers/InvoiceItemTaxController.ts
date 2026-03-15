import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateInvoiceItemTaxUseCase } from '../useCases/CreateInvoiceItemTaxUseCase';
import { GetInvoiceItemTaxUseCase } from '../useCases/GetInvoiceItemTaxUseCase';
import { GetInvoiceItemTaxesByInvoiceItemUseCase } from '../useCases/GetInvoiceItemTaxesByInvoiceItemUseCase';
import { DeleteInvoiceItemTaxUseCase } from '../useCases/DeleteInvoiceItemTaxUseCase';

function toResponse(t: {
    id: string;
    props: {
        invoiceItemId: string;
        dianCode: string;
        taxBase: number;
        taxPercentage: number;
        taxAmount: number;
        createdAt?: Date;
    };
}) {
    return {
        id: t.id,
        invoiceItemId: t.props.invoiceItemId,
        dianCode: t.props.dianCode,
        taxBase: t.props.taxBase,
        taxPercentage: t.props.taxPercentage,
        taxAmount: t.props.taxAmount,
        createdAt: t.props.createdAt?.toISOString() ?? null,
    };
}

@injectable()
export class InvoiceItemTaxController {
    constructor(
        private readonly createInvoiceItemTaxUseCase: CreateInvoiceItemTaxUseCase,
        private readonly getInvoiceItemTaxUseCase: GetInvoiceItemTaxUseCase,
        private readonly getByInvoiceItemUseCase: GetInvoiceItemTaxesByInvoiceItemUseCase,
        private readonly deleteInvoiceItemTaxUseCase: DeleteInvoiceItemTaxUseCase
    ) {}

    async getByInvoiceItem(request: Request, response: Response): Promise<Response> {
        const invoiceItemId = request.query.invoiceItemId as string;
        const list = await this.getByInvoiceItemUseCase.execute(invoiceItemId);
        return response.status(200).json(list.map(toResponse));
    }

    async getById(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const tax = await this.getInvoiceItemTaxUseCase.execute(id);
        return response.status(200).json(toResponse(tax));
    }

    async create(request: Request, response: Response): Promise<Response> {
        const tax = await this.createInvoiceItemTaxUseCase.execute(request.body);
        return response.status(201).json(toResponse(tax));
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        await this.deleteInvoiceItemTaxUseCase.execute(id);
        return response.status(204).send();
    }
}

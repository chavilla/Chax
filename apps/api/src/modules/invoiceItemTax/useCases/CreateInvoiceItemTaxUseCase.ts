import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { InvoiceItemTax } from '../domain/entities/InvoiceItemTax';
import { IInvoiceItemTaxRepository } from '../domain/repositories/IInvoiceItemTaxRepository';
import { InvoiceItemTaxRepositoryToken } from '../../../shared/container/tokens';
import type { CreateInvoiceItemTaxDTO } from '../dtos/invoiceItemTax.dtos';

@injectable()
export class CreateInvoiceItemTaxUseCase implements UseCase<CreateInvoiceItemTaxDTO, InvoiceItemTax> {
    constructor(
        @inject(InvoiceItemTaxRepositoryToken)
        private readonly invoiceItemTaxRepository: IInvoiceItemTaxRepository
    ) {}

    async execute(request: CreateInvoiceItemTaxDTO): Promise<InvoiceItemTax> {
        return this.invoiceItemTaxRepository.create({
            invoiceItemId: request.invoiceItemId,
            dianCode: request.dianCode,
            taxBase: request.taxBase,
            taxPercentage: request.taxPercentage,
            taxAmount: request.taxAmount,
        });
    }
}

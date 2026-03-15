import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { InvoiceItemTax } from '../domain/entities/InvoiceItemTax';
import { IInvoiceItemTaxRepository } from '../domain/repositories/IInvoiceItemTaxRepository';
import { InvoiceItemTaxRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetInvoiceItemTaxesByInvoiceItemUseCase
    implements UseCase<string, InvoiceItemTax[]>
{
    constructor(
        @inject(InvoiceItemTaxRepositoryToken)
        private readonly invoiceItemTaxRepository: IInvoiceItemTaxRepository
    ) {}

    async execute(invoiceItemId: string): Promise<InvoiceItemTax[]> {
        return this.invoiceItemTaxRepository.findByInvoiceItemId(invoiceItemId);
    }
}

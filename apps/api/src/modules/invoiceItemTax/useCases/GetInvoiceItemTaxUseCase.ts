import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { InvoiceItemTax } from '../domain/entities/InvoiceItemTax';
import { IInvoiceItemTaxRepository } from '../domain/repositories/IInvoiceItemTaxRepository';
import { AppError } from '../../../shared/errors/AppError';
import { InvoiceItemTaxRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetInvoiceItemTaxUseCase implements UseCase<string, InvoiceItemTax> {
    constructor(
        @inject(InvoiceItemTaxRepositoryToken)
        private readonly invoiceItemTaxRepository: IInvoiceItemTaxRepository
    ) {}

    async execute(id: string): Promise<InvoiceItemTax> {
        const tax = await this.invoiceItemTaxRepository.findById(id);
        if (!tax) {
            throw new AppError('Desglose de impuesto no encontrado', 404);
        }
        return tax;
    }
}

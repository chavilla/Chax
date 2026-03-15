import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IInvoiceItemTaxRepository } from '../domain/repositories/IInvoiceItemTaxRepository';
import { AppError } from '../../../shared/errors/AppError';
import { InvoiceItemTaxRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class DeleteInvoiceItemTaxUseCase implements UseCase<string, void> {
    constructor(
        @inject(InvoiceItemTaxRepositoryToken)
        private readonly invoiceItemTaxRepository: IInvoiceItemTaxRepository
    ) {}

    async execute(id: string): Promise<void> {
        const existing = await this.invoiceItemTaxRepository.findById(id);
        if (!existing) {
            throw new AppError('Desglose de impuesto no encontrado', 404);
        }
        await this.invoiceItemTaxRepository.delete(id);
    }
}

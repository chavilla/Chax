import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IInvoiceRepository, InvoiceItemWithId } from '../domain/repositories/IInvoiceRepository';
import { Invoice } from '../domain/entities/Invoice';
import { AppError } from '../../../shared/errors/AppError';
import { InvoiceRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetInvoiceUseCase implements UseCase<string, { invoice: Invoice; items: InvoiceItemWithId[] }> {
    constructor(
        @inject(InvoiceRepositoryToken) private readonly invoiceRepository: IInvoiceRepository
    ) {}

    async execute(id: string): Promise<{ invoice: Invoice; items: InvoiceItemWithId[] }> {
        const result = await this.invoiceRepository.findByIdWithItems(id);
        if (!result) {
            throw new AppError('Factura no encontrada', 404);
        }
        return result;
    }
}

import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IInvoiceRepository } from '../domain/repositories/IInvoiceRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { Invoice } from '../domain/entities/Invoice';
import { AppError } from '../../../shared/errors/AppError';
import { InvoiceRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetInvoicesUseCase implements UseCase<string, Invoice[]> {
    constructor(
        @inject(InvoiceRepositoryToken) private readonly invoiceRepository: IInvoiceRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(organizationId: string): Promise<Invoice[]> {
        const organization = await this.organizationRepository.findById(organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }
        return this.invoiceRepository.findAllByOrganization(organizationId);
    }
}

import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IInvoiceResolutionRepository } from '../domain/repositories/IInvoiceResolutionRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { InvoiceResolution } from '../domain/entities/InvoiceResolution';
import { AppError } from '../../../shared/errors/AppError';
import { InvoiceResolutionRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetInvoiceResolutionsUseCase implements UseCase<string, InvoiceResolution[]> {
    constructor(
        @inject(InvoiceResolutionRepositoryToken) private readonly resolutionRepository: IInvoiceResolutionRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(organizationId: string): Promise<InvoiceResolution[]> {
        const organization = await this.organizationRepository.findById(organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }
        return this.resolutionRepository.findAllByOrganization(organizationId);
    }
}

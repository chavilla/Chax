import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ISupplierRepository } from '../domain/repositories/ISupplierRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { Supplier } from '../domain/entities/Supplier';
import { AppError } from '../../../shared/errors/AppError';
import { SupplierRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetSuppliersUseCase implements UseCase<string, Supplier[]> {
    constructor(
        @inject(SupplierRepositoryToken) private readonly supplierRepository: ISupplierRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(organizationId: string): Promise<Supplier[]> {
        const organization = await this.organizationRepository.findById(organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }
        return this.supplierRepository.findAllByOrganization(organizationId);
    }
}

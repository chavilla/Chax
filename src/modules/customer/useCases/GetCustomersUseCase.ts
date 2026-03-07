import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICustomerRepository } from '../domain/repositories/ICustomerRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { Customer } from '../domain/entities/Customer';
import { AppError } from '../../../shared/errors/AppError';
import { CustomerRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetCustomersUseCase implements UseCase<string, Customer[]> {
    constructor(
        @inject(CustomerRepositoryToken) private readonly customerRepository: ICustomerRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(organizationId: string): Promise<Customer[]> {
        const organization = await this.organizationRepository.findById(organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }
        return this.customerRepository.findAllByOrganization(organizationId);
    }
}

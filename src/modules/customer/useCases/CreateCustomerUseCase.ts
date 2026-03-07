import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICustomerRepository } from '../domain/repositories/ICustomerRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { CreateCustomerDTO } from '../dtos/customer.dtos';
import { Customer } from '../domain/entities/Customer';
import { AppError } from '../../../shared/errors/AppError';
import { IdType, TaxRegime } from '@prisma/client';
import { CustomerRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class CreateCustomerUseCase implements UseCase<CreateCustomerDTO, Customer> {
    constructor(
        @inject(CustomerRepositoryToken) private readonly customerRepository: ICustomerRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(request: CreateCustomerDTO): Promise<Customer> {
        const organization = await this.organizationRepository.findById(request.organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }

        const idType = (request.idType as IdType) ?? IdType.CC;
        const exists = await this.customerRepository.existsByIdTypeAndIdNumberAndOrganization(
            request.organizationId,
            idType,
            request.idNumber
        );
        if (exists) {
            throw new AppError(
                `Ya existe un cliente con esta identificación (${idType} ${request.idNumber}) en esta organización`
            );
        }

        const customer = Customer.create({
            idType,
            idNumber: request.idNumber,
            dv: request.dv ?? null,
            name: request.name,
            email: request.email ?? null,
            phone: request.phone ?? null,
            address: request.address ?? null,
            city: request.city ?? null,
            department: request.department ?? null,
            taxRegime: (request.taxRegime as TaxRegime) ?? TaxRegime.NO_RESPONSABLE_IVA,
            fiscalResponsibilities: request.fiscalResponsibilities ?? null,
            organizationId: request.organizationId,
        });

        await this.customerRepository.save(customer);
        return customer;
    }
}

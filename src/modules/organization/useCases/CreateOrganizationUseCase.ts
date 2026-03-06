import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IOrganizationRepository } from '../domain/repositories/IOrganizationRepository';
import { CreateOrganizationDTO } from '../dtos/organization.dtos';
import { Organization } from '../domain/entities/Organization';
import { AppError } from '../../../shared/errors/AppError';
import { TaxRegime } from '@prisma/client';
import { OrganizationRepositoryToken } from '../../../shared/container/tokens';

type Response = Organization;

@injectable()
export class CreateOrganizationUseCase implements UseCase<CreateOrganizationDTO, Response> {
    constructor(
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    public async execute(request: CreateOrganizationDTO): Promise<Response> {
        const { nit } = request;

        // 1. Validate if the organization already exists
        const organizationAlreadyExists = await this.organizationRepository.exists(nit);
        if (organizationAlreadyExists) {
            throw new AppError(`Organization with NIT ${nit} already exists`);
        }

        // 2. Create the domain entity
        const organizationOrError = Organization.create({
            ...request,
            taxRegime: request.taxRegime || TaxRegime.NO_RESPONSABLE_IVA,
            usesDian: request.usesDian || false,
        });

        // 3. Persist the entity
        await this.organizationRepository.save(organizationOrError);

        return organizationOrError;
    }
}

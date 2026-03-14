import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IOrganizationRepository } from '../domain/repositories/IOrganizationRepository';
import { Organization } from '../domain/entities/Organization';
import { OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetOrganizationsUseCase implements UseCase<void, Organization[]> {
    constructor(
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(): Promise<Organization[]> {
        return this.organizationRepository.findAll();
    }
}

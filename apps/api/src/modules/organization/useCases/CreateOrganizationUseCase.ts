import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IOrganizationRepository } from '../domain/repositories/IOrganizationRepository';
import { CreateOrganizationDTO } from '../dtos/organization.dtos';
import { Organization } from '../domain/entities/Organization';
import { AppError } from '../../../shared/errors/AppError';
import { TaxRegime } from '@chax/shared';
import { OrganizationRepositoryToken } from '../../../shared/container/tokens';
import { AuditRecorder } from '../../../shared/audit/AuditRecorder';

type Response = Organization;

@injectable()
export class CreateOrganizationUseCase implements UseCase<CreateOrganizationDTO, Response> {
    constructor(
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(AuditRecorder) private readonly auditRecorder: AuditRecorder
    ) {}

    public async execute(request: CreateOrganizationDTO): Promise<Response> {
        const { nit } = request;

        // 1. Validate if the organization already exists
        const organizationAlreadyExists = await this.organizationRepository.exists(nit);
        if (organizationAlreadyExists) {
            throw new AppError(`Organización con NIT ${nit} ya existe`);
        }

        // 2. Create the domain entity
        const organizationOrError = Organization.create({
            ...request,
            taxRegime: request.taxRegime || TaxRegime.NO_RESPONSABLE_IVA,
            usesDian: request.usesDian || false,
        });

        // 3. Persist the entity
        await this.organizationRepository.save(organizationOrError);
        await this.auditRecorder.recordIfUser(request.performedByUserId, {
            action: 'CREATE',
            entity: 'Organization',
            entityId: organizationOrError.id,
            newValues: { nit: organizationOrError.props.nit, businessName: organizationOrError.props.businessName, usesDian: organizationOrError.props.usesDian },
            organizationId: organizationOrError.id,
        });
        return organizationOrError;
    }
}

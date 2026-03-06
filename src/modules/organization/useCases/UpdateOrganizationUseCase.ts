import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IOrganizationRepository } from '../domain/repositories/IOrganizationRepository';
import { UpdateOrganizationDTO } from '../dtos/organization.dtos';
import { Organization } from '../domain/entities/Organization';
import { AppError } from '../../../shared/errors/AppError';
import { OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class UpdateOrganizationUseCase implements UseCase<UpdateOrganizationDTO, Organization> {
    constructor(
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(request: UpdateOrganizationDTO): Promise<Organization> {
        const { id, ...updates } = request;

        const existing = await this.organizationRepository.findById(id);
        if (!existing) {
            throw new AppError('Organization not found', 404);
        }

        const mergedProps = {
            nit: updates.nit ?? existing.props.nit,
            dv: updates.dv ?? existing.props.dv,
            businessName: updates.businessName ?? existing.props.businessName,
            tradeName: updates.tradeName ?? existing.props.tradeName,
            address: updates.address ?? existing.props.address,
            city: updates.city ?? existing.props.city,
            department: updates.department ?? existing.props.department,
            phone: updates.phone ?? existing.props.phone,
            email: updates.email ?? existing.props.email,
            economicActivityCode: updates.economicActivityCode ?? existing.props.economicActivityCode,
            taxRegime: updates.taxRegime ?? existing.props.taxRegime,
            usesDian: updates.usesDian ?? existing.props.usesDian,
            logoUrl: updates.logoUrl ?? existing.props.logoUrl,
            createdAt: existing.props.createdAt,
            updatedAt: new Date(),
        };

        const updatedOrganization = Organization.create(mergedProps, id);
        await this.organizationRepository.save(updatedOrganization);

        return updatedOrganization;
    }
}

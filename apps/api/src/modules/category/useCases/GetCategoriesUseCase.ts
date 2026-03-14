import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICategoryRepository } from '../domain/repositories/ICategoryRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { Category } from '../domain/entities/Category';
import { AppError } from '../../../shared/errors/AppError';
import { CategoryRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetCategoriesUseCase implements UseCase<string, Category[]> {
    constructor(
        @inject(CategoryRepositoryToken) private readonly categoryRepository: ICategoryRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(organizationId: string): Promise<Category[]> {
        const organization = await this.organizationRepository.findById(organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }
        return this.categoryRepository.findAllByOrganization(organizationId);
    }
}

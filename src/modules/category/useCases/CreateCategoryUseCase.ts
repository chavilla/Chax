import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICategoryRepository } from '../domain/repositories/ICategoryRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { CreateCategoryDTO } from '../dtos/category.dtos';
import { Category } from '../domain/entities/Category';
import { AppError } from '../../../shared/errors/AppError';
import { CategoryRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class CreateCategoryUseCase implements UseCase<CreateCategoryDTO, Category> {
    constructor(
        @inject(CategoryRepositoryToken) private readonly categoryRepository: ICategoryRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(request: CreateCategoryDTO): Promise<Category> {
        const organization = await this.organizationRepository.findById(request.organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }

        const exists = await this.categoryRepository.existsByNameAndOrganization(
            request.organizationId,
            request.name
                );
        if (exists) {
            throw new AppError(`Ya existe una categoría con el nombre "${request.name}" en esta organización`);
        }

        const category = Category.create({
            name: request.name,
            description: request.description ?? null,
            organizationId: request.organizationId,
        });

        await this.categoryRepository.save(category);
        return category;
    }
}

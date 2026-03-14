import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICategoryRepository } from '../domain/repositories/ICategoryRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { UpdateCategoryDTO } from '../dtos/category.dtos';
import { Category } from '../domain/entities/Category';
import { AppError } from '../../../shared/errors/AppError';
import { CategoryRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class UpdateCategoryUseCase implements UseCase<UpdateCategoryDTO, Category> {
    constructor(
        @inject(CategoryRepositoryToken) private readonly categoryRepository: ICategoryRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(request: UpdateCategoryDTO): Promise<Category> {
        const { id, ...updates } = request;

        const existing = await this.categoryRepository.findById(id);
        if (!existing) {
            throw new AppError('Categoría no encontrada', 404);
        }

        const organizationId = updates.organizationId ?? existing.props.organizationId;

        if (updates.organizationId) {
            const organization = await this.organizationRepository.findById(updates.organizationId);
            if (!organization) {
                throw new AppError('Organización no encontrada', 404);
            }
        }

        if (updates.name !== undefined && updates.name !== existing.props.name) {
            const exists = await this.categoryRepository.existsByNameAndOrganization(
                organizationId,
                updates.name,
                id
            );
            if (exists) {
                throw new AppError(`Ya existe una categoría con el nombre "${updates.name}" en esta organización`);
            }
        }

        const mergedProps = {
            name: updates.name ?? existing.props.name,
            description: updates.description !== undefined ? updates.description : existing.props.description,
            organizationId,
            createdAt: existing.props.createdAt,
            updatedAt: new Date(),
        };

        const updatedCategory = Category.create(mergedProps, id);
        await this.categoryRepository.save(updatedCategory);

        return updatedCategory;
    }
}

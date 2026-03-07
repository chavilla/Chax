import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { Product } from '../domain/entities/Product';
import { AppError } from '../../../shared/errors/AppError';
import { ProductRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetProductsUseCase implements UseCase<string, Product[]> {
    constructor(
        @inject(ProductRepositoryToken) private readonly productRepository: IProductRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(organizationId: string): Promise<Product[]> {
        const organization = await this.organizationRepository.findById(organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }
        return this.productRepository.findAllByOrganization(organizationId);
    }
}

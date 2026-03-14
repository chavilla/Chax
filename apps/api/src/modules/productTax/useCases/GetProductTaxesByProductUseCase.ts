import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IProductTaxRepository } from '../domain/repositories/IProductTaxRepository';
import { IProductRepository } from '../../product/domain/repositories/IProductRepository';
import { ProductTax } from '../domain/entities/ProductTax';
import { AppError } from '../../../shared/errors/AppError';
import { ProductTaxRepositoryToken, ProductRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetProductTaxesByProductUseCase implements UseCase<string, ProductTax[]> {
    constructor(
        @inject(ProductTaxRepositoryToken) private readonly productTaxRepository: IProductTaxRepository,
        @inject(ProductRepositoryToken) private readonly productRepository: IProductRepository
    ) {}

    async execute(productId: string): Promise<ProductTax[]> {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new AppError('Producto no encontrado', 404);
        }
        return this.productTaxRepository.findByProductId(productId);
    }
}

import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IProductTaxRepository } from '../domain/repositories/IProductTaxRepository';
import { IProductRepository } from '../../product/domain/repositories/IProductRepository';
import { ProductTax } from '../domain/entities/ProductTax';
import { AppError } from '../../../shared/errors/AppError';
import { ProductTaxRepositoryToken, ProductRepositoryToken } from '../../../shared/container/tokens';
import type { CreateProductTaxDTO } from '../dtos/productTax.dtos';

@injectable()
export class CreateProductTaxUseCase implements UseCase<CreateProductTaxDTO, ProductTax> {
    constructor(
        @inject(ProductTaxRepositoryToken) private readonly productTaxRepository: IProductTaxRepository,
        @inject(ProductRepositoryToken) private readonly productRepository: IProductRepository
    ) {}

    async execute(request: CreateProductTaxDTO): Promise<ProductTax> {
        const product = await this.productRepository.findById(request.productId);
        if (!product) {
            throw new AppError('Producto no encontrado', 404);
        }

        const productTax = ProductTax.create({
            productId: request.productId,
            taxType: request.taxType,
            percentage: request.percentage,
            fixedAmount: request.fixedAmount ?? null,
        });

        await this.productTaxRepository.save(productTax);
        return productTax;
    }
}

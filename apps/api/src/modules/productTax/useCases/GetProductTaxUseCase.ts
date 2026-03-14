import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IProductTaxRepository } from '../domain/repositories/IProductTaxRepository';
import { ProductTax } from '../domain/entities/ProductTax';
import { AppError } from '../../../shared/errors/AppError';
import { ProductTaxRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetProductTaxUseCase implements UseCase<string, ProductTax> {
    constructor(
        @inject(ProductTaxRepositoryToken) private readonly productTaxRepository: IProductTaxRepository
    ) {}

    async execute(id: string): Promise<ProductTax> {
        const productTax = await this.productTaxRepository.findById(id);
        if (!productTax) {
            throw new AppError('Impuesto de producto no encontrado', 404);
        }
        return productTax;
    }
}

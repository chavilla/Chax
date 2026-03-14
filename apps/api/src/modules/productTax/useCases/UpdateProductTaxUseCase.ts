import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IProductTaxRepository } from '../domain/repositories/IProductTaxRepository';
import { ProductTax } from '../domain/entities/ProductTax';
import { AppError } from '../../../shared/errors/AppError';
import { ProductTaxRepositoryToken } from '../../../shared/container/tokens';
import type { UpdateProductTaxDTO } from '../dtos/productTax.dtos';

@injectable()
export class UpdateProductTaxUseCase implements UseCase<UpdateProductTaxDTO, ProductTax> {
    constructor(
        @inject(ProductTaxRepositoryToken) private readonly productTaxRepository: IProductTaxRepository
    ) {}

    async execute(request: UpdateProductTaxDTO): Promise<ProductTax> {
        const existing = await this.productTaxRepository.findById(request.id);
        if (!existing) {
            throw new AppError('Impuesto de producto no encontrado', 404);
        }

        const updated = ProductTax.create(
            {
                productId: request.productId ?? existing.props.productId,
                taxType: request.taxType ?? existing.props.taxType,
                percentage: request.percentage ?? existing.props.percentage,
                fixedAmount: request.fixedAmount !== undefined ? request.fixedAmount : existing.props.fixedAmount,
                createdAt: existing.props.createdAt,
            },
            request.id
        );

        await this.productTaxRepository.update(updated);
        return updated;
    }
}

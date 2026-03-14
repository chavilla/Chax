import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IProductTaxRepository } from '../domain/repositories/IProductTaxRepository';
import { AppError } from '../../../shared/errors/AppError';
import { ProductTaxRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class DeleteProductTaxUseCase implements UseCase<string, void> {
    constructor(
        @inject(ProductTaxRepositoryToken) private readonly productTaxRepository: IProductTaxRepository
    ) {}

    async execute(id: string): Promise<void> {
        const existing = await this.productTaxRepository.findById(id);
        if (!existing) {
            throw new AppError('Impuesto de producto no encontrado', 404);
        }
        await this.productTaxRepository.delete(id);
    }
}

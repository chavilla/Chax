import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IStockMovementRepository, KardexRow } from '../domain/repositories/IStockMovementRepository';
import { IProductRepository } from '../../product/domain/repositories/IProductRepository';
import { AppError } from '../../../shared/errors/AppError';
import { StockMovementRepositoryToken, ProductRepositoryToken } from '../../../shared/container/tokens';

export interface GetKardexInput {
    organizationId: string;
    productId: string;
    from?: Date;
    to?: Date;
}

@injectable()
export class GetKardexByProductUseCase implements UseCase<GetKardexInput, KardexRow[]> {
    constructor(
        @inject(StockMovementRepositoryToken) private readonly stockMovementRepository: IStockMovementRepository,
        @inject(ProductRepositoryToken) private readonly productRepository: IProductRepository
    ) {}

    async execute(request: GetKardexInput): Promise<KardexRow[]> {
        const product = await this.productRepository.findById(request.productId);
        if (!product) {
            throw new AppError('Producto no encontrado', 404);
        }
        if (product.props.organizationId !== request.organizationId) {
            throw new AppError('Producto no encontrado', 404);
        }

        return this.stockMovementRepository.findByProduct(request.productId, {
            from: request.from,
            to: request.to,
        });
    }
}

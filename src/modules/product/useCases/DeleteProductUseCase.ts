import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { AppError } from '../../../shared/errors/AppError';
import { ProductRepositoryToken } from '../../../shared/container/tokens';

type DeleteProductDTO = { id: string; organizationId: string };

@injectable()
export class DeleteProductUseCase implements UseCase<DeleteProductDTO, void> {
    constructor(
        @inject(ProductRepositoryToken) private readonly productRepository: IProductRepository
    ) {}

    async execute(request: DeleteProductDTO): Promise<void> {
        const { id, organizationId } = request;

        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError('Producto no encontrado', 404);
        }

        if (product.props.organizationId !== organizationId) {
            throw new AppError('Producto no encontrado', 404);
        }

        const { invoiceItems, stockMovements } = await this.productRepository.countDependencies(id);

        if (invoiceItems > 0) {
            throw new AppError(
                'No se puede eliminar el producto porque tiene líneas en facturas asociadas',
                400
            );
        }

        if (stockMovements > 0) {
            throw new AppError(
                'No se puede eliminar el producto porque tiene movimientos de inventario asociados',
                400
            );
        }

        await this.productRepository.delete(id);
    }
}

import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IPurchaseRepository, PurchaseItemToPersist } from '../domain/repositories/IPurchaseRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { ISupplierRepository } from '../../supplier/domain/repositories/ISupplierRepository';
import { IProductRepository } from '../../product/domain/repositories/IProductRepository';
import { Purchase } from '../domain/entities/Purchase';
import { AppError } from '../../../shared/errors/AppError';
import {
    PurchaseRepositoryToken,
    OrganizationRepositoryToken,
    SupplierRepositoryToken,
    ProductRepositoryToken,
} from '../../../shared/container/tokens';
import type { CreatePurchaseDTO } from '../dtos/purchase.dtos';

@injectable()
export class CreatePurchaseUseCase implements UseCase<CreatePurchaseDTO, Purchase> {
    constructor(
        @inject(PurchaseRepositoryToken) private readonly purchaseRepository: IPurchaseRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(SupplierRepositoryToken) private readonly supplierRepository: ISupplierRepository,
        @inject(ProductRepositoryToken) private readonly productRepository: IProductRepository
    ) {}

    async execute(request: CreatePurchaseDTO): Promise<Purchase> {
        const organization = await this.organizationRepository.findById(request.organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }

        const supplier = await this.supplierRepository.findById(request.supplierId);
        if (!supplier) {
            throw new AppError('Proveedor no encontrado', 404);
        }
        if (supplier.props.organizationId !== request.organizationId) {
            throw new AppError('El proveedor no pertenece a esta organización', 400);
        }

        const itemsToPersist: PurchaseItemToPersist[] = [];
        const productStockUpdates: { productId: string; newStock: number; newCostPrice: number }[] = [];
        const stockMovements: {
            productId: string;
            quantity: number;
            previousStock: number;
            newStock: number;
            unitCost: number;
            supplierId: string;
            organizationId: string;
            reference?: string | null;
        }[] = [];

        let totalSum = 0;

        for (const item of request.items) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new AppError(`Producto no encontrado: ${item.productId}`, 404);
            }
            if (product.props.organizationId !== request.organizationId) {
                throw new AppError(`El producto no pertenece a esta organización`, 400);
            }
            if (!product.props.isActive) {
                throw new AppError(`El producto ${product.props.name} no está activo`, 400);
            }
            if (item.quantity <= 0) {
                throw new AppError(`La cantidad debe ser mayor a 0 para ${product.props.name}`, 400);
            }
            if (item.unitCost < 0) {
                throw new AppError(`El costo unitario no puede ser negativo para ${product.props.name}`, 400);
            }

            const subtotal = Number((item.quantity * item.unitCost).toFixed(2));
            totalSum += subtotal;

            itemsToPersist.push({
                productId: product.id,
                quantity: item.quantity,
                unitCost: item.unitCost,
                subtotal,
            });

            const currentStock = product.props.stock;
            const currentCostPrice = product.props.costPrice ?? 0;
            const newStock = currentStock + item.quantity;
            const newCostPrice =
                newStock === 0
                    ? item.unitCost
                    : Number(
                          (
                              (currentStock * currentCostPrice + item.quantity * item.unitCost) /
                              newStock
                          ).toFixed(2)
                      );
            productStockUpdates.push({ productId: product.id, newStock, newCostPrice });
            stockMovements.push({
                productId: product.id,
                quantity: item.quantity,
                previousStock: product.props.stock,
                newStock,
                unitCost: item.unitCost,
                supplierId: request.supplierId,
                organizationId: request.organizationId,
                reference: request.reference ?? null,
            });
        }

        const total = Number(totalSum.toFixed(2));
        const purchase = Purchase.create(
            {
                supplierId: request.supplierId,
                organizationId: request.organizationId,
                purchaseDate: request.purchaseDate ? new Date(request.purchaseDate) : new Date(),
                reference: request.reference ?? null,
                notes: request.notes ?? null,
                total,
            },
            undefined
        );

        await this.purchaseRepository.createWithItemsAndStock({
            purchase,
            items: itemsToPersist,
            productStockUpdates,
            stockMovements,
        });

        return purchase;
    }
}

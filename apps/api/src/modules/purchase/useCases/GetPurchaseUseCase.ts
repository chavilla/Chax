import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IPurchaseRepository } from '../domain/repositories/IPurchaseRepository';
import { Purchase } from '../domain/entities/Purchase';
import { PurchaseItemWithId } from '../domain/repositories/IPurchaseRepository';
import { AppError } from '../../../shared/errors/AppError';
import { PurchaseRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetPurchaseUseCase implements UseCase<string, { purchase: Purchase; items: PurchaseItemWithId[] }> {
    constructor(
        @inject(PurchaseRepositoryToken) private readonly purchaseRepository: IPurchaseRepository
    ) {}

    async execute(id: string): Promise<{ purchase: Purchase; items: PurchaseItemWithId[] }> {
        const result = await this.purchaseRepository.findByIdWithItems(id);
        if (!result) {
            throw new AppError('Compra no encontrada', 404);
        }
        return result;
    }
}

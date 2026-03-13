import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IPurchaseRepository } from '../domain/repositories/IPurchaseRepository';
import { Purchase } from '../domain/entities/Purchase';
import { PurchaseRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetPurchasesUseCase implements UseCase<string, Purchase[]> {
    constructor(
        @inject(PurchaseRepositoryToken) private readonly purchaseRepository: IPurchaseRepository
    ) {}

    async execute(organizationId: string): Promise<Purchase[]> {
        return this.purchaseRepository.findAllByOrganization(organizationId);
    }
}

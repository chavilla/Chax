import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { DianLog } from '../domain/entities/DianLog';
import { IDianLogRepository } from '../domain/repositories/IDianLogRepository';
import { DianLogRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetDianLogsByInvoiceUseCase implements UseCase<string, DianLog[]> {
    constructor(
        @inject(DianLogRepositoryToken)
        private readonly dianLogRepository: IDianLogRepository
    ) {}

    async execute(invoiceId: string): Promise<DianLog[]> {
        return this.dianLogRepository.findByInvoiceId(invoiceId);
    }
}

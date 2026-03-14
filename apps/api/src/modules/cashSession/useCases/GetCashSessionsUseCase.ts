import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICashSessionRepository } from '../domain/repositories/ICashSessionRepository';
import { CashSession } from '../domain/entities/CashSession';
import { CashSessionRepositoryToken } from '../../../shared/container/tokens';

export interface GetCashSessionsInput {
    organizationId: string;
    isClosed?: boolean;
}

@injectable()
export class GetCashSessionsUseCase implements UseCase<GetCashSessionsInput, CashSession[]> {
    constructor(
        @inject(CashSessionRepositoryToken) private readonly cashSessionRepository: ICashSessionRepository
    ) {}

    async execute(request: GetCashSessionsInput): Promise<CashSession[]> {
        return this.cashSessionRepository.findAllByOrganization(request.organizationId, {
            isClosed: request.isClosed,
        });
    }
}

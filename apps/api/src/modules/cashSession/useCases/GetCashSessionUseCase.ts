import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICashSessionRepository } from '../domain/repositories/ICashSessionRepository';
import { CashSession } from '../domain/entities/CashSession';
import { AppError } from '../../../shared/errors/AppError';
import { CashSessionRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetCashSessionUseCase implements UseCase<string, CashSession> {
    constructor(
        @inject(CashSessionRepositoryToken) private readonly cashSessionRepository: ICashSessionRepository
    ) {}

    async execute(id: string): Promise<CashSession> {
        const session = await this.cashSessionRepository.findById(id);
        if (!session) {
            throw new AppError('Sesión de caja no encontrada', 404);
        }
        return session;
    }
}

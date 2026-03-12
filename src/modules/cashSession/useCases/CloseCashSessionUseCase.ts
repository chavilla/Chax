import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICashSessionRepository } from '../domain/repositories/ICashSessionRepository';
import { CashSession } from '../domain/entities/CashSession';
import { AppError } from '../../../shared/errors/AppError';
import { CashSessionRepositoryToken } from '../../../shared/container/tokens';
import type { CloseCashSessionDTO } from '../dtos/cashSession.dtos';

@injectable()
export class CloseCashSessionUseCase implements UseCase<CloseCashSessionDTO, CashSession> {
    constructor(
        @inject(CashSessionRepositoryToken) private readonly cashSessionRepository: ICashSessionRepository
    ) {}

    async execute(request: CloseCashSessionDTO): Promise<CashSession> {
        const session = await this.cashSessionRepository.findById(request.id);
        if (!session) {
            throw new AppError('Sesión de caja no encontrada', 404);
        }
        if (session.props.isClosed) {
            throw new AppError('La sesión de caja ya está cerrada', 400);
        }

        const closedAt = new Date();
        const updated = CashSession.create(
            {
                ...session.props,
                closingAmount: request.closingAmount,
                expectedAmount: request.expectedAmount ?? null,
                difference: request.difference ?? null,
                totalCash: request.totalCash ?? null,
                totalCard: request.totalCard ?? null,
                totalTransfer: request.totalTransfer ?? null,
                closedAt,
                notes: request.notes ?? session.props.notes ?? null,
                isClosed: true,
            },
            session.id
        );

        await this.cashSessionRepository.update(updated);
        return updated;
    }
}

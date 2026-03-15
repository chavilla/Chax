import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { DianLog } from '../domain/entities/DianLog';
import { IDianLogRepository } from '../domain/repositories/IDianLogRepository';
import { AppError } from '../../../shared/errors/AppError';
import { DianLogRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetDianLogUseCase implements UseCase<string, DianLog> {
    constructor(
        @inject(DianLogRepositoryToken)
        private readonly dianLogRepository: IDianLogRepository
    ) {}

    async execute(id: string): Promise<DianLog> {
        const log = await this.dianLogRepository.findById(id);
        if (!log) {
            throw new AppError('Log DIAN no encontrado', 404);
        }
        return log;
    }
}

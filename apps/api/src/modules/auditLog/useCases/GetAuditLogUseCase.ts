import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { AuditLog } from '../domain/entities/AuditLog';
import { IAuditLogRepository } from '../domain/repositories/IAuditLogRepository';
import { AppError } from '../../../shared/errors/AppError';
import { AuditLogRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetAuditLogUseCase implements UseCase<string, AuditLog> {
    constructor(
        @inject(AuditLogRepositoryToken)
        private readonly auditLogRepository: IAuditLogRepository
    ) {}

    async execute(id: string): Promise<AuditLog> {
        const log = await this.auditLogRepository.findById(id);
        if (!log) {
            throw new AppError('Registro de auditoría no encontrado', 404);
        }
        return log;
    }
}

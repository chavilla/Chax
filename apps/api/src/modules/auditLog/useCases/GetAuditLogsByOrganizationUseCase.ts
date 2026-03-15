import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { AuditLog } from '../domain/entities/AuditLog';
import { IAuditLogRepository } from '../domain/repositories/IAuditLogRepository';
import { FindByOrganizationOptions } from '../domain/repositories/IAuditLogRepository';
import { AuditLogRepositoryToken } from '../../../shared/container/tokens';

export interface GetAuditLogsByOrganizationInput {
    organizationId: string;
    entity?: string;
    entityId?: string;
    userId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
}

@injectable()
export class GetAuditLogsByOrganizationUseCase
    implements UseCase<GetAuditLogsByOrganizationInput, AuditLog[]>
{
    constructor(
        @inject(AuditLogRepositoryToken)
        private readonly auditLogRepository: IAuditLogRepository
    ) {}

    async execute(
        input: GetAuditLogsByOrganizationInput
    ): Promise<AuditLog[]> {
        const options: FindByOrganizationOptions = {
            entity: input.entity,
            entityId: input.entityId,
            userId: input.userId,
            from: input.from,
            to: input.to,
            limit: input.limit,
        };
        return this.auditLogRepository.findByOrganizationId(
            input.organizationId,
            options
        );
    }
}

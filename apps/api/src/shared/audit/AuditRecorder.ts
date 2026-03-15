import { injectable, inject } from 'tsyringe';
import { IAuditLogRepository, AuditLogCreateData } from '../../modules/auditLog/domain/repositories/IAuditLogRepository';
import { AuditLogRepositoryToken } from '../container/tokens';

export interface AuditRecordParams {
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: string;
    entityId: string;
    oldValues?: Record<string, unknown> | string | null;
    newValues?: Record<string, unknown> | string | null;
    userId: string;
    organizationId: string;
    ipAddress?: string | null;
}

/** Serializa valores para el log (objeto → JSON string). */
function serialize(value: Record<string, unknown> | string | null | undefined): string | null {
    if (value == null) return null;
    if (typeof value === 'string') return value;
    try {
        return JSON.stringify(value);
    } catch {
        return null;
    }
}

/**
 * Punto único para registrar auditoría. Los use cases lo inyectan y llaman
 * record() después de persistir. Si userId no está presente, no se registra.
 */
@injectable()
export class AuditRecorder {
    constructor(
        @inject(AuditLogRepositoryToken)
        private readonly auditLogRepository: IAuditLogRepository
    ) {}

    async record(params: AuditRecordParams): Promise<void> {
        const data: AuditLogCreateData = {
            action: params.action,
            entity: params.entity,
            entityId: params.entityId,
            oldValues: serialize(params.oldValues),
            newValues: serialize(params.newValues),
            userId: params.userId,
            organizationId: params.organizationId,
            ipAddress: params.ipAddress ?? null,
        };
        await this.auditLogRepository.create(data);
    }

    /** Registra solo si performedByUserId y organizationId están presentes. */
    async recordIfUser(
        performedByUserId: string | undefined | null,
        params: Omit<AuditRecordParams, 'userId'>
    ): Promise<void> {
        if (!performedByUserId?.trim() || !params.organizationId?.trim()) return;
        await this.record({ ...params, userId: performedByUserId });
    }
}

import { AuditLog } from '../entities/AuditLog';

export interface FindByOrganizationOptions {
    entity?: string;
    entityId?: string;
    userId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
}

export interface AuditLogCreateData {
    action: string;
    entity: string;
    entityId: string;
    oldValues?: string | null;
    newValues?: string | null;
    userId: string;
    organizationId: string;
    ipAddress?: string | null;
}

export interface IAuditLogRepository {
    findById(id: string): Promise<AuditLog | null>;
    findByOrganizationId(
        organizationId: string,
        options?: FindByOrganizationOptions
    ): Promise<AuditLog[]>;
    create(data: AuditLogCreateData): Promise<void>;
}

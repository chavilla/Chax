import { injectable } from 'tsyringe';
import {
    IAuditLogRepository,
    FindByOrganizationOptions,
    AuditLogCreateData,
} from '../domain/repositories/IAuditLogRepository';
import { AuditLog } from '../domain/entities/AuditLog';
import { prisma } from '../../../infrastructure/database/prisma';

type PrismaAuditLog = NonNullable<
    Awaited<ReturnType<typeof prisma.auditLog.findUnique>>
>;

@injectable()
export class PrismaAuditLogRepository implements IAuditLogRepository {
    async findById(id: string): Promise<AuditLog | null> {
        const row = await prisma.auditLog.findUnique({
            where: { id },
        });
        if (!row) return null;
        return this.mapToDomain(row);
    }

    async findByOrganizationId(
        organizationId: string,
        options?: FindByOrganizationOptions
    ): Promise<AuditLog[]> {
        const limit = options?.limit ?? 100;
        const where: {
            organizationId: string;
            entity?: string;
            entityId?: string;
            userId?: string;
            createdAt?: { gte?: Date; lte?: Date };
        } = { organizationId };

        if (options?.entity) where.entity = options.entity;
        if (options?.entityId) where.entityId = options.entityId;
        if (options?.userId) where.userId = options.userId;
        if (options?.from ?? options?.to) {
            where.createdAt = {};
            if (options?.from) where.createdAt.gte = options.from;
            if (options?.to) where.createdAt.lte = options.to;
        }

        const list = await prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return list.map((r: PrismaAuditLog) => this.mapToDomain(r));
    }

    async create(data: AuditLogCreateData): Promise<void> {
        await prisma.auditLog.create({
            data: {
                action: data.action,
                entity: data.entity,
                entityId: data.entityId,
                oldValues: data.oldValues ?? null,
                newValues: data.newValues ?? null,
                ipAddress: data.ipAddress ?? null,
                userId: data.userId,
                organizationId: data.organizationId,
            },
        });
    }

    private mapToDomain(row: PrismaAuditLog): AuditLog {
        return AuditLog.create(
            {
                action: row.action,
                entity: row.entity,
                entityId: row.entityId,
                oldValues: row.oldValues ?? null,
                newValues: row.newValues ?? null,
                ipAddress: row.ipAddress ?? null,
                userId: row.userId,
                organizationId: row.organizationId,
                createdAt: row.createdAt,
            },
            row.id
        );
    }
}

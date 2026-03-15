import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { getOrganizationIdFromRequest } from '../../../shared/auth/getAuthContext';
import { GetAuditLogUseCase } from '../useCases/GetAuditLogUseCase';
import { GetAuditLogsByOrganizationUseCase } from '../useCases/GetAuditLogsByOrganizationUseCase';

function toResponse(log: {
    id: string;
    props: {
        action: string;
        entity: string;
        entityId: string;
        oldValues?: string | null;
        newValues?: string | null;
        ipAddress?: string | null;
        userId: string;
        organizationId: string;
        createdAt?: Date;
    };
}) {
    return {
        id: log.id,
        action: log.props.action,
        entity: log.props.entity,
        entityId: log.props.entityId,
        oldValues: log.props.oldValues ?? null,
        newValues: log.props.newValues ?? null,
        ipAddress: log.props.ipAddress ?? null,
        userId: log.props.userId,
        organizationId: log.props.organizationId,
        createdAt: log.props.createdAt?.toISOString() ?? null,
    };
}

@injectable()
export class AuditLogController {
    constructor(
        private readonly getAuditLogUseCase: GetAuditLogUseCase,
        private readonly getByOrganizationUseCase: GetAuditLogsByOrganizationUseCase
    ) {}

    async getById(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const log = await this.getAuditLogUseCase.execute(id);
        return response.status(200).json(toResponse(log));
    }

    async getByOrganization(
        request: Request,
        response: Response
    ): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const entity = request.query.entity as string | undefined;
        const entityId = request.query.entityId as string | undefined;
        const userId = request.query.userId as string | undefined;
        const from = request.query.from
            ? new Date(request.query.from as string)
            : undefined;
        const to = request.query.to
            ? new Date(request.query.to as string)
            : undefined;
        const limit = request.query.limit
            ? Number(request.query.limit)
            : undefined;

        const list = await this.getByOrganizationUseCase.execute({
            organizationId,
            entity,
            entityId,
            userId,
            from,
            to,
            limit,
        });
        return response.status(200).json(list.map(toResponse));
    }
}

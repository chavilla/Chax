import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateCashSessionUseCase } from '../useCases/CreateCashSessionUseCase';
import { CloseCashSessionUseCase } from '../useCases/CloseCashSessionUseCase';
import { GetCashSessionUseCase } from '../useCases/GetCashSessionUseCase';
import { GetCashSessionsUseCase } from '../useCases/GetCashSessionsUseCase';
import type { CashSession } from '../domain/entities/CashSession';
import { getOrganizationIdFromRequest, getAuthContext } from '../../../shared/auth/getAuthContext';

@injectable()
export class CashSessionController {
    constructor(
        private readonly createCashSessionUseCase: CreateCashSessionUseCase,
        private readonly closeCashSessionUseCase: CloseCashSessionUseCase,
        private readonly getCashSessionUseCase: GetCashSessionUseCase,
        private readonly getCashSessionsUseCase: GetCashSessionsUseCase
    ) {}

    private toResponse(session: CashSession) {
        return {
            id: session.id,
            openingAmount: session.props.openingAmount,
            closingAmount: session.props.closingAmount ?? null,
            expectedAmount: session.props.expectedAmount ?? null,
            difference: session.props.difference ?? null,
            totalCash: session.props.totalCash ?? null,
            totalCard: session.props.totalCard ?? null,
            totalTransfer: session.props.totalTransfer ?? null,
            openedAt: session.props.openedAt,
            closedAt: session.props.closedAt ?? null,
            notes: session.props.notes ?? null,
            isClosed: session.props.isClosed,
            userId: session.props.userId,
            organizationId: session.props.organizationId,
        };
    }

    async create(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const session = await this.createCashSessionUseCase.execute({
            ...request.body,
            organizationId: ctx.organizationId,
            userId: ctx.userId,
        });
        return response.status(201).json(this.toResponse(session));
    }

    async close(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const session = await this.closeCashSessionUseCase.execute({
            id,
            ...request.body,
        });
        return response.status(200).json(this.toResponse(session));
    }

    async getById(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const session = await this.getCashSessionUseCase.execute(id);
        return response.status(200).json(this.toResponse(session));
    }

    async getSessions(request: Request, response: Response): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const isClosedRaw = request.query.isClosed;
        const isClosed =
            isClosedRaw === 'true' ? true : isClosedRaw === 'false' ? false : undefined;
        const sessions = await this.getCashSessionsUseCase.execute({ organizationId, isClosed });
        return response.status(200).json(sessions.map((s) => this.toResponse(s)));
    }
}

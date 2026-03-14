import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateCashSessionUseCase } from '../useCases/CreateCashSessionUseCase';
import { CloseCashSessionUseCase } from '../useCases/CloseCashSessionUseCase';
import { GetCashSessionUseCase } from '../useCases/GetCashSessionUseCase';
import { GetCashSessionsUseCase } from '../useCases/GetCashSessionsUseCase';
import { AppError } from '../../../shared/errors/AppError';
import type { CashSession } from '../domain/entities/CashSession';

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
        try {
            const session = await this.createCashSessionUseCase.execute(request.body);
            return response.status(201).json(this.toResponse(session));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async close(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            const session = await this.closeCashSessionUseCase.execute({
                id,
                closingAmount: request.body.closingAmount,
                expectedAmount: request.body.expectedAmount,
                difference: request.body.difference,
                totalCash: request.body.totalCash,
                totalCard: request.body.totalCard,
                totalTransfer: request.body.totalTransfer,
                notes: request.body.notes,
            });
            return response.status(200).json(this.toResponse(session));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async getById(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            const session = await this.getCashSessionUseCase.execute(id);
            return response.status(200).json(this.toResponse(session));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async getSessions(request: Request, response: Response): Promise<Response> {
        try {
            const organizationId = request.query.organizationId as string;
            const isClosedRaw = request.query.isClosed;
            const isClosed =
                isClosedRaw === 'true' ? true : isClosedRaw === 'false' ? false : undefined;
            const sessions = await this.getCashSessionsUseCase.execute({ organizationId, isClosed });
            return response.status(200).json(sessions.map((s) => this.toResponse(s)));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}

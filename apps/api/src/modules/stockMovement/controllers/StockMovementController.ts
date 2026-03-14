import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { GetKardexByProductUseCase } from '../useCases/GetKardexByProductUseCase';
import { AppError } from '../../../shared/errors/AppError';
import type { KardexRow } from '../domain/repositories/IStockMovementRepository';

@injectable()
export class StockMovementController {
    constructor(private readonly getKardexByProductUseCase: GetKardexByProductUseCase) {}

    private movementToResponse(row: KardexRow) {
        return {
            id: row.id,
            type: row.type,
            quantity: row.quantity,
            previousStock: row.previousStock,
            newStock: row.newStock,
            unitCost: row.unitCost,
            reason: row.reason,
            reference: row.reference,
            productId: row.productId,
            supplierId: row.supplierId,
            organizationId: row.organizationId,
            createdAt: row.createdAt,
        };
    }

    async getKardex(request: Request, response: Response): Promise<Response> {
        try {
            const organizationId = request.query.organizationId as string;
            const productId = request.query.productId as string;
            const from = request.query.from ? new Date(request.query.from as string) : undefined;
            const to = request.query.to ? new Date(request.query.to as string) : undefined;

            const movements = await this.getKardexByProductUseCase.execute({
                organizationId,
                productId,
                from,
                to,
            });

            return response.status(200).json(movements.map((m) => this.movementToResponse(m)));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            const message = err instanceof Error ? err.message : 'Internal server error';
            console.error('[StockMovementController.getKardex]', err);
            return response.status(500).json({ status: 'error', message });
        }
    }
}

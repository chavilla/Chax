import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { getOrganizationIdFromRequest } from '../../../shared/auth/getAuthContext';
import { GetKardexByProductUseCase } from '../useCases/GetKardexByProductUseCase';
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
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
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
    }
}

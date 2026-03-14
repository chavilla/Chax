import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreatePurchaseUseCase } from '../useCases/CreatePurchaseUseCase';
import { GetPurchaseUseCase } from '../useCases/GetPurchaseUseCase';
import { GetPurchasesUseCase } from '../useCases/GetPurchasesUseCase';
import { AppError } from '../../../shared/errors/AppError';
import type { Purchase } from '../domain/entities/Purchase';
import type { PurchaseItemWithId } from '../domain/repositories/IPurchaseRepository';

@injectable()
export class PurchaseController {
    constructor(
        private readonly createPurchaseUseCase: CreatePurchaseUseCase,
        private readonly getPurchaseUseCase: GetPurchaseUseCase,
        private readonly getPurchasesUseCase: GetPurchasesUseCase
    ) {}

    private purchaseToResponse(purchase: Purchase) {
        return {
            id: purchase.id,
            supplierId: purchase.props.supplierId,
            organizationId: purchase.props.organizationId,
            purchaseDate: purchase.props.purchaseDate,
            reference: purchase.props.reference ?? null,
            notes: purchase.props.notes ?? null,
            total: purchase.props.total,
        };
    }

    private itemToResponse(item: PurchaseItemWithId) {
        return {
            id: item.id,
            purchaseId: item.purchaseId,
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            subtotal: item.subtotal,
        };
    }

    async create(request: Request, response: Response): Promise<Response> {
        try {
            const purchase = await this.createPurchaseUseCase.execute(request.body);
            return response.status(201).json(this.purchaseToResponse(purchase));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            const message = err instanceof Error ? err.message : 'Internal server error';
            console.error('[PurchaseController.create]', err);
            return response.status(500).json({ status: 'error', message });
        }
    }

    async getById(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            const { purchase, items } = await this.getPurchaseUseCase.execute(id);
            return response.status(200).json({
                ...this.purchaseToResponse(purchase),
                items: items.map((i) => this.itemToResponse(i)),
            });
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            const message = err instanceof Error ? err.message : 'Internal server error';
            console.error('[PurchaseController.getById]', err);
            return response.status(500).json({ status: 'error', message });
        }
    }

    async getPurchases(request: Request, response: Response): Promise<Response> {
        try {
            const organizationId = request.query.organizationId as string;
            const purchases = await this.getPurchasesUseCase.execute(organizationId);
            return response.status(200).json(purchases.map((p) => this.purchaseToResponse(p)));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            const message = err instanceof Error ? err.message : 'Internal server error';
            console.error('[PurchaseController.getPurchases]', err);
            return response.status(500).json({ status: 'error', message });
        }
    }
}

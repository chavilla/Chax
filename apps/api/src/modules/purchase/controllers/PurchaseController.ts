import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreatePurchaseUseCase } from '../useCases/CreatePurchaseUseCase';
import { GetPurchaseUseCase } from '../useCases/GetPurchaseUseCase';
import { GetPurchasesUseCase } from '../useCases/GetPurchasesUseCase';
import type { Purchase } from '../domain/entities/Purchase';
import type { PurchaseItemWithId } from '../domain/repositories/IPurchaseRepository';
import { getOrganizationIdFromRequest, getAuthContext } from '../../../shared/auth/getAuthContext';

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
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const purchase = await this.createPurchaseUseCase.execute({
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(201).json(this.purchaseToResponse(purchase));
    }

    async getById(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const { purchase, items } = await this.getPurchaseUseCase.execute(id);
        return response.status(200).json({
            ...this.purchaseToResponse(purchase),
            items: items.map((i) => this.itemToResponse(i)),
        });
    }

    async getPurchases(request: Request, response: Response): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const purchases = await this.getPurchasesUseCase.execute(organizationId);
        return response.status(200).json(purchases.map((p) => this.purchaseToResponse(p)));
    }
}

import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateProductUseCase } from '../useCases/CreateProductUseCase';
import { UpdateProductUseCase } from '../useCases/UpdateProductUseCase';
import { GetProductsUseCase } from '../useCases/GetProductsUseCase';
import { DeleteProductUseCase } from '../useCases/DeleteProductUseCase';
import { Product } from '../domain/entities/Product';
import { getOrganizationIdFromRequest, getAuthContext } from '../../../shared/auth/getAuthContext';

@injectable()
export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly getProductsUseCase: GetProductsUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase
    ) {}

    private toResponse(product: Product) {
        return {
            id: product.id,
            internalCode: product.props.internalCode,
            barcode: product.props.barcode ?? null,
            name: product.props.name,
            description: product.props.description ?? null,
            salePrice: product.props.salePrice,
            costPrice: product.props.costPrice,
            unitOfMeasure: product.props.unitOfMeasure,
            taxType: product.props.taxType,
            taxPercentage: product.props.taxPercentage,
            stock: product.props.stock,
            minStock: product.props.minStock,
            isActive: product.props.isActive,
            categoryId: product.props.categoryId ?? null,
            organizationId: product.props.organizationId,
        };
    }

    async getProducts(request: Request, response: Response): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const products = await this.getProductsUseCase.execute(organizationId);
        return response.status(200).json(products.map((p) => this.toResponse(p)));
    }

    async create(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const product = await this.createProductUseCase.execute({
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(201).json(this.toResponse(product));
    }

    async update(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const id = request.params.id as string;
        const product = await this.updateProductUseCase.execute({
            id,
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(200).json(this.toResponse(product));
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const id = request.params.id as string;
        const userId = request.user?.id ?? null;
        await this.deleteProductUseCase.execute({ id, organizationId, performedByUserId: userId ?? undefined });
        return response.status(204).send();
    }
}

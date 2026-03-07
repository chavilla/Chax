import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateProductUseCase } from '../useCases/CreateProductUseCase';
import { UpdateProductUseCase } from '../useCases/UpdateProductUseCase';
import { GetProductsUseCase } from '../useCases/GetProductsUseCase';
import { DeleteProductUseCase } from '../useCases/DeleteProductUseCase';
import { AppError } from '../../../shared/errors/AppError';
import { Product } from '../domain/entities/Product';

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
        try {
            const organizationId = request.query.organizationId as string;
            const products = await this.getProductsUseCase.execute(organizationId);
            return response.status(200).json(products.map((p) => this.toResponse(p)));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async create(request: Request, response: Response): Promise<Response> {
        try {
            const {
                internalCode,
                internalCodePrefix,
                barcode,
                name,
                description,
                salePrice,
                costPrice,
                unitOfMeasure,
                taxType,
                taxPercentage,
                stock,
                minStock,
                isActive,
                categoryId,
                organizationId,
            } = request.body;

            const product = await this.createProductUseCase.execute({
                internalCode,
                internalCodePrefix,
                barcode,
                name,
                description,
                salePrice,
                costPrice,
                unitOfMeasure,
                taxType,
                taxPercentage,
                stock,
                minStock,
                isActive,
                categoryId,
                organizationId,
            });

            return response.status(201).json(this.toResponse(product));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            const body = request.body as Record<string, unknown>;
            const product = await this.updateProductUseCase.execute({ id, ...body });
            return response.status(200).json(this.toResponse(product));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async delete(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            const organizationId = request.query.organizationId as string;
            await this.deleteProductUseCase.execute({ id, organizationId });
            return response.status(204).send();
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}

import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateProductTaxUseCase } from '../useCases/CreateProductTaxUseCase';
import { GetProductTaxUseCase } from '../useCases/GetProductTaxUseCase';
import { GetProductTaxesByProductUseCase } from '../useCases/GetProductTaxesByProductUseCase';
import { UpdateProductTaxUseCase } from '../useCases/UpdateProductTaxUseCase';
import { DeleteProductTaxUseCase } from '../useCases/DeleteProductTaxUseCase';

function toResponse(pt: { id: string; props: { productId: string; taxType: string; percentage: number; fixedAmount?: number | null; createdAt?: Date } }) {
    return {
        id: pt.id,
        productId: pt.props.productId,
        taxType: pt.props.taxType,
        percentage: pt.props.percentage,
        fixedAmount: pt.props.fixedAmount ?? null,
        createdAt: pt.props.createdAt?.toISOString() ?? null,
    };
}

@injectable()
export class ProductTaxController {
    constructor(
        private readonly createProductTaxUseCase: CreateProductTaxUseCase,
        private readonly getProductTaxUseCase: GetProductTaxUseCase,
        private readonly getProductTaxesByProductUseCase: GetProductTaxesByProductUseCase,
        private readonly updateProductTaxUseCase: UpdateProductTaxUseCase,
        private readonly deleteProductTaxUseCase: DeleteProductTaxUseCase
    ) {}

    async getByProduct(request: Request, response: Response): Promise<Response> {
        const productId = request.query.productId as string;
        const list = await this.getProductTaxesByProductUseCase.execute(productId);
        return response.status(200).json(list.map(toResponse));
    }

    async getById(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const productTax = await this.getProductTaxUseCase.execute(id);
        return response.status(200).json(toResponse(productTax));
    }

    async create(request: Request, response: Response): Promise<Response> {
        const productTax = await this.createProductTaxUseCase.execute(request.body);
        return response.status(201).json(toResponse(productTax));
    }

    async update(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const productTax = await this.updateProductTaxUseCase.execute({ id, ...request.body });
        return response.status(200).json(toResponse(productTax));
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        await this.deleteProductTaxUseCase.execute(id);
        return response.status(204).send();
    }
}

import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateCategoryUseCase } from '../useCases/CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '../useCases/UpdateCategoryUseCase';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class CategoryController {
    constructor(
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly updateCategoryUseCase: UpdateCategoryUseCase
    ) {}

    async create(request: Request, response: Response): Promise<Response> {
        try {
            const { name, description, organizationId } = request.body;

            const category = await this.createCategoryUseCase.execute({
                name,
                description,
                organizationId,
            });

            return response.status(201).json({
                id: category.id,
                name: category.props.name,
                description: category.props.description ?? null,
                organizationId: category.props.organizationId,
            });
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

            const category = await this.updateCategoryUseCase.execute({
                id,
                ...body,
            });

            return response.status(200).json({
                id: category.id,
                name: category.props.name,
                description: category.props.description ?? null,
                organizationId: category.props.organizationId,
            });
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }

            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}

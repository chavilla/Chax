import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateCategoryUseCase } from '../useCases/CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '../useCases/UpdateCategoryUseCase';
import { GetCategoriesUseCase } from '../useCases/GetCategoriesUseCase';
import { getOrganizationIdFromRequest, getAuthContext } from '../../../shared/auth/getAuthContext';

@injectable()
export class CategoryController {
    constructor(
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly updateCategoryUseCase: UpdateCategoryUseCase,
        private readonly getCategoriesUseCase: GetCategoriesUseCase
    ) {}

    private toResponse(cat: { id: string; props: { name: string; description?: string | null; organizationId: string } }) {
        return {
            id: cat.id,
            name: cat.props.name,
            description: cat.props.description ?? null,
            organizationId: cat.props.organizationId,
        };
    }

    async getCategories(request: Request, response: Response): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const categories = await this.getCategoriesUseCase.execute(organizationId);
        return response.status(200).json(categories.map((c) => this.toResponse(c)));
    }

    async create(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const { name, description } = request.body;
        const category = await this.createCategoryUseCase.execute({
            name,
            description,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(201).json(this.toResponse(category));
    }

    async update(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const id = request.params.id as string;
        const category = await this.updateCategoryUseCase.execute({
            id,
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(200).json(this.toResponse(category));
    }
}

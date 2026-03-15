import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateInvoiceResolutionUseCase } from '../useCases/CreateInvoiceResolutionUseCase';
import { UpdateInvoiceResolutionUseCase } from '../useCases/UpdateInvoiceResolutionUseCase';
import { GetInvoiceResolutionsUseCase } from '../useCases/GetInvoiceResolutionsUseCase';
import { GetInvoiceResolutionUseCase } from '../useCases/GetInvoiceResolutionUseCase';
import { getOrganizationIdFromRequest, getAuthContext } from '../../../shared/auth/getAuthContext';

@injectable()
export class InvoiceResolutionController {
    constructor(
        private readonly createResolutionUseCase: CreateInvoiceResolutionUseCase,
        private readonly updateResolutionUseCase: UpdateInvoiceResolutionUseCase,
        private readonly getResolutionsUseCase: GetInvoiceResolutionsUseCase,
        private readonly getResolutionUseCase: GetInvoiceResolutionUseCase
    ) {}

    private toResponse(resolution: {
        id: string;
        props: {
            name?: string | null;
            resolutionNumber?: string | null;
            prefix: string;
            rangeStart: number;
            rangeEnd: number;
            currentNumber: number;
            startDate?: Date | null;
            endDate?: Date | null;
            technicalKey?: string | null;
            isActive: boolean;
            organizationId: string;
        };
    }) {
        return {
            id: resolution.id,
            name: resolution.props.name ?? null,
            resolutionNumber: resolution.props.resolutionNumber ?? null,
            prefix: resolution.props.prefix,
            rangeStart: resolution.props.rangeStart,
            rangeEnd: resolution.props.rangeEnd,
            currentNumber: resolution.props.currentNumber,
            startDate: resolution.props.startDate ?? null,
            endDate: resolution.props.endDate ?? null,
            technicalKey: resolution.props.technicalKey ?? null,
            isActive: resolution.props.isActive,
            organizationId: resolution.props.organizationId,
        };
    }

    async getResolutions(request: Request, response: Response): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const list = await this.getResolutionsUseCase.execute(organizationId);
        return response.status(200).json(list.map((r) => this.toResponse(r)));
    }

    async getById(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const resolution = await this.getResolutionUseCase.execute(id);
        return response.status(200).json(this.toResponse(resolution));
    }

    async create(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const resolution = await this.createResolutionUseCase.execute({
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(201).json(this.toResponse(resolution));
    }

    async update(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const id = request.params.id as string;
        const resolution = await this.updateResolutionUseCase.execute({
            id,
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(200).json(this.toResponse(resolution));
    }
}

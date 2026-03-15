import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateOrganizationUseCase } from '../useCases/CreateOrganizationUseCase';
import { UpdateOrganizationUseCase } from '../useCases/UpdateOrganizationUseCase';
import { GetOrganizationsUseCase } from '../useCases/GetOrganizationsUseCase';
import { getUserId } from '../../../shared/auth/getAuthContext';

@injectable()
export class OrganizationController {
    constructor(
        private readonly createOrganizationUseCase: CreateOrganizationUseCase,
        private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
        private readonly getOrganizationsUseCase: GetOrganizationsUseCase
    ) {}

    private toResponse(org: { id: string; props: { nit: string; businessName: string; tradeName?: string | null; city: string; email: string; usesDian: boolean } }) {
        return {
            id: org.id,
            nit: org.props.nit,
            businessName: org.props.businessName,
            tradeName: org.props.tradeName ?? null,
            city: org.props.city,
            email: org.props.email,
            usesDian: org.props.usesDian,
        };
    }

    async getOrganizations(_request: Request, response: Response): Promise<Response> {
        const organizations = await this.getOrganizationsUseCase.execute();
        return response.status(200).json(organizations.map((o) => this.toResponse(o)));
    }

    async create(request: Request, response: Response): Promise<Response> {
        const performedByUserId = getUserId(request) ?? undefined;
        const organization = await this.createOrganizationUseCase.execute({
            ...request.body,
            performedByUserId,
        });
        return response.status(201).json(this.toResponse(organization));
    }

    async update(request: Request, response: Response): Promise<Response> {
        const id = request.params.id as string;
        const performedByUserId = getUserId(request) ?? undefined;
        const organization = await this.updateOrganizationUseCase.execute({
            id,
            ...request.body,
            performedByUserId,
        });
        return response.status(200).json(this.toResponse(organization));
    }
}

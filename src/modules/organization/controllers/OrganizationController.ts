import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateOrganizationUseCase } from '../useCases/CreateOrganizationUseCase';
import { UpdateOrganizationUseCase } from '../useCases/UpdateOrganizationUseCase';
import { GetOrganizationsUseCase } from '../useCases/GetOrganizationsUseCase';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class OrganizationController {
    constructor(
        private readonly createOrganizationUseCase: CreateOrganizationUseCase,
        private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
        private readonly getOrganizationsUseCase: GetOrganizationsUseCase
    ) {}

    async getOrganizations(_request: Request, response: Response): Promise<Response> {
        try {
            const organizations = await this.getOrganizationsUseCase.execute();
            return response.status(200).json(
                organizations.map((org) => ({
                    id: org.id,
                    nit: org.props.nit,
                    businessName: org.props.businessName,
                    tradeName: org.props.tradeName ?? null,
                    city: org.props.city,
                    email: org.props.email,
                    usesDian: org.props.usesDian,
                }))
            );
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
                nit,
                dv,
                businessName,
                tradeName,
                address,
                city,
                department,
                phone,
                email,
                economicActivityCode,
                taxRegime,
                usesDian,
                logoUrl,
            } = request.body;

            // Notice how the controller only delegates to the use case.
            // DTO validations (like Zod/Yup) would normally happen just before this block.
            const organization = await this.createOrganizationUseCase.execute({
                nit,
                dv,
                businessName,
                tradeName,
                address,
                city,
                department,
                phone,
                email,
                economicActivityCode,
                taxRegime,
                usesDian,
                logoUrl,
            });

            return response.status(201).json({
                id: organization.id,
                nit: organization.props.nit,
                businessName: organization.props.businessName,
                usesDian: organization.props.usesDian,
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

            const organization = await this.updateOrganizationUseCase.execute({
                id,
                ...body,
            });

            return response.status(200).json({
                id: organization.id,
                nit: organization.props.nit,
                businessName: organization.props.businessName,
                usesDian: organization.props.usesDian,
            });
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }

            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}

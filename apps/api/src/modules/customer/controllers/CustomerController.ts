import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateCustomerUseCase } from '../useCases/CreateCustomerUseCase';
import { UpdateCustomerUseCase } from '../useCases/UpdateCustomerUseCase';
import { GetCustomersUseCase } from '../useCases/GetCustomersUseCase';
import { getOrganizationIdFromRequest, getAuthContext } from '../../../shared/auth/getAuthContext';

@injectable()
export class CustomerController {
    constructor(
        private readonly createCustomerUseCase: CreateCustomerUseCase,
        private readonly updateCustomerUseCase: UpdateCustomerUseCase,
        private readonly getCustomersUseCase: GetCustomersUseCase
    ) {}

    private toResponse(customer: {
        id: string;
        props: {
            idType: string;
            idNumber: string;
            dv?: string | null;
            name: string;
            email?: string | null;
            phone?: string | null;
            address?: string | null;
            city?: string | null;
            department?: string | null;
            taxRegime: string;
            fiscalResponsibilities?: string | null;
            organizationId: string;
        };
    }) {
        return {
            id: customer.id,
            idType: customer.props.idType,
            idNumber: customer.props.idNumber,
            dv: customer.props.dv ?? null,
            name: customer.props.name,
            email: customer.props.email ?? null,
            phone: customer.props.phone ?? null,
            address: customer.props.address ?? null,
            city: customer.props.city ?? null,
            department: customer.props.department ?? null,
            taxRegime: customer.props.taxRegime,
            fiscalResponsibilities: customer.props.fiscalResponsibilities ?? null,
            organizationId: customer.props.organizationId,
        };
    }

    async getCustomers(request: Request, response: Response): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const customers = await this.getCustomersUseCase.execute(organizationId);
        return response.status(200).json(customers.map((c) => this.toResponse(c)));
    }

    async create(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const customer = await this.createCustomerUseCase.execute({
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(201).json(this.toResponse(customer));
    }

    async update(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const id = request.params.id as string;
        const customer = await this.updateCustomerUseCase.execute({
            id,
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(200).json(this.toResponse(customer));
    }
}

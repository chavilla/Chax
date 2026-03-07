import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateCustomerUseCase } from '../useCases/CreateCustomerUseCase';
import { UpdateCustomerUseCase } from '../useCases/UpdateCustomerUseCase';
import { GetCustomersUseCase } from '../useCases/GetCustomersUseCase';
import { AppError } from '../../../shared/errors/AppError';

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
        try {
            const organizationId = request.query.organizationId as string;
            const customers = await this.getCustomersUseCase.execute(organizationId);
            return response.status(200).json(customers.map((c) => this.toResponse(c)));
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
                idType,
                idNumber,
                dv,
                name,
                email,
                phone,
                address,
                city,
                department,
                taxRegime,
                fiscalResponsibilities,
                organizationId,
            } = request.body;

            const customer = await this.createCustomerUseCase.execute({
                idType,
                idNumber,
                dv,
                name,
                email,
                phone,
                address,
                city,
                department,
                taxRegime,
                fiscalResponsibilities,
                organizationId,
            });

            return response.status(201).json(this.toResponse(customer));
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
            const customer = await this.updateCustomerUseCase.execute({ id, ...body });
            return response.status(200).json(this.toResponse(customer));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}

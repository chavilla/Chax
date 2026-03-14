import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateSupplierUseCase } from '../useCases/CreateSupplierUseCase';
import { UpdateSupplierUseCase } from '../useCases/UpdateSupplierUseCase';
import { GetSuppliersUseCase } from '../useCases/GetSuppliersUseCase';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class SupplierController {
    constructor(
        private readonly createSupplierUseCase: CreateSupplierUseCase,
        private readonly updateSupplierUseCase: UpdateSupplierUseCase,
        private readonly getSuppliersUseCase: GetSuppliersUseCase
    ) {}

    private toResponse(supplier: {
        id: string;
        props: {
            idType: string;
            idNumber: string;
            name: string;
            contactName?: string | null;
            email?: string | null;
            phone?: string | null;
            address?: string | null;
            city?: string | null;
            department?: string | null;
            notes?: string | null;
            organizationId: string;
        };
    }) {
        return {
            id: supplier.id,
            idType: supplier.props.idType,
            idNumber: supplier.props.idNumber,
            name: supplier.props.name,
            contactName: supplier.props.contactName ?? null,
            email: supplier.props.email ?? null,
            phone: supplier.props.phone ?? null,
            address: supplier.props.address ?? null,
            city: supplier.props.city ?? null,
            department: supplier.props.department ?? null,
            notes: supplier.props.notes ?? null,
            organizationId: supplier.props.organizationId,
        };
    }

    async getSuppliers(request: Request, response: Response): Promise<Response> {
        try {
            const organizationId = request.query.organizationId as string;
            const suppliers = await this.getSuppliersUseCase.execute(organizationId);
            return response.status(200).json(suppliers.map((s) => this.toResponse(s)));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async create(request: Request, response: Response): Promise<Response> {
        try {
            const supplier = await this.createSupplierUseCase.execute(request.body);
            return response.status(201).json(this.toResponse(supplier));
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
            const supplier = await this.updateSupplierUseCase.execute({ id, ...request.body });
            return response.status(200).json(this.toResponse(supplier));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}

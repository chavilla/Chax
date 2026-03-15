import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateSupplierUseCase } from '../useCases/CreateSupplierUseCase';
import { UpdateSupplierUseCase } from '../useCases/UpdateSupplierUseCase';
import { GetSuppliersUseCase } from '../useCases/GetSuppliersUseCase';
import { getOrganizationIdFromRequest, getAuthContext } from '../../../shared/auth/getAuthContext';

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
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const suppliers = await this.getSuppliersUseCase.execute(organizationId);
        return response.status(200).json(suppliers.map((s) => this.toResponse(s)));
    }

    async create(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const supplier = await this.createSupplierUseCase.execute({
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(201).json(this.toResponse(supplier));
    }

    async update(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const id = request.params.id as string;
        const supplier = await this.updateSupplierUseCase.execute({
            id,
            ...request.body,
            organizationId: ctx.organizationId,
            performedByUserId: ctx.userId,
        });
        return response.status(200).json(this.toResponse(supplier));
    }
}

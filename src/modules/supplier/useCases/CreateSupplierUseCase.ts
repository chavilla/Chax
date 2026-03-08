import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ISupplierRepository } from '../domain/repositories/ISupplierRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { CreateSupplierDTO } from '../dtos/supplier.dtos';
import { Supplier } from '../domain/entities/Supplier';
import { AppError } from '../../../shared/errors/AppError';
import { IdType } from '@prisma/client';
import { SupplierRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class CreateSupplierUseCase implements UseCase<CreateSupplierDTO, Supplier> {
    constructor(
        @inject(SupplierRepositoryToken) private readonly supplierRepository: ISupplierRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(request: CreateSupplierDTO): Promise<Supplier> {
        const organization = await this.organizationRepository.findById(request.organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }

        const existsByIdNumber = await this.supplierRepository.existsByIdNumberAndOrganization(
            request.organizationId,
            request.idNumber
        );
        if (existsByIdNumber) {
            throw new AppError(
                `Ya existe un proveedor con el documento ${request.idNumber} en esta organización`
            );
        }

        const nameTrimmed = request.name?.trim() ?? '';
        const existsByName = await this.supplierRepository.existsByNameAndOrganization(
            request.organizationId,
            nameTrimmed
        );
        if (existsByName) {
            throw new AppError(
                `Ya existe un proveedor con la razón social "${nameTrimmed}" en esta organización`
            );
        }

        const contactNameTrimmed = request.contactName?.trim();
        if (contactNameTrimmed && contactNameTrimmed.length > 0) {
            const existsByContact = await this.supplierRepository.existsByContactNameAndOrganization(
                request.organizationId,
                contactNameTrimmed
            );
            if (existsByContact) {
                throw new AppError(
                    `Ya existe un proveedor con el nombre de contacto "${contactNameTrimmed}" en esta organización`
                );
            }
        }

        const supplier = Supplier.create({
            idType: request.idType as IdType,
            idNumber: request.idNumber,
            name: request.name,
            contactName: request.contactName ?? null,
            email: request.email ?? null,
            phone: request.phone ?? null,
            address: request.address ?? null,
            city: request.city ?? null,
            department: request.department ?? null,
            notes: request.notes ?? null,
            organizationId: request.organizationId,
        });

        await this.supplierRepository.save(supplier);
        return supplier;
    }
}

import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ISupplierRepository } from '../domain/repositories/ISupplierRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { UpdateSupplierDTO } from '../dtos/supplier.dtos';
import { Supplier } from '../domain/entities/Supplier';
import { AppError } from '../../../shared/errors/AppError';
import { SupplierRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';
import { AuditRecorder } from '../../../shared/audit/AuditRecorder';

@injectable()
export class UpdateSupplierUseCase implements UseCase<UpdateSupplierDTO, Supplier> {
    constructor(
        @inject(SupplierRepositoryToken) private readonly supplierRepository: ISupplierRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(AuditRecorder) private readonly auditRecorder: AuditRecorder
    ) {}

    async execute(request: UpdateSupplierDTO): Promise<Supplier> {
        const { id, ...updates } = request;

        const existing = await this.supplierRepository.findById(id);
        if (!existing) {
            throw new AppError('Proveedor no encontrado', 404);
        }

        const organizationId = updates.organizationId ?? existing.props.organizationId;

        if (updates.organizationId) {
            const organization = await this.organizationRepository.findById(updates.organizationId);
            if (!organization) {
                throw new AppError('Organización no encontrada', 404);
            }
        }

        if (updates.idNumber !== undefined && updates.idNumber !== existing.props.idNumber) {
            const exists = await this.supplierRepository.existsByIdNumberAndOrganization(
                organizationId,
                updates.idNumber,
                id
            );
            if (exists) {
                throw new AppError(
                    `Ya existe un proveedor con el documento ${updates.idNumber} en esta organización`
                );
            }
        }

        const nameTrimmed = updates.name !== undefined ? updates.name.trim() : null;
        if (nameTrimmed !== null && nameTrimmed !== existing.props.name.trim()) {
            const existsByName = await this.supplierRepository.existsByNameAndOrganization(
                organizationId,
                nameTrimmed,
                id
            );
            if (existsByName) {
                throw new AppError(
                    `Ya existe un proveedor con la razón social "${nameTrimmed}" en esta organización`
                );
            }
        }

        const contactNameTrimmed = updates.contactName !== undefined
            ? (updates.contactName ?? '').trim()
            : null;
        if (contactNameTrimmed !== null && contactNameTrimmed.length > 0) {
            const currentContact = existing.props.contactName?.trim() ?? '';
            if (contactNameTrimmed !== currentContact) {
                const existsByContact = await this.supplierRepository.existsByContactNameAndOrganization(
                    organizationId,
                    contactNameTrimmed,
                    id
                );
                if (existsByContact) {
                    throw new AppError(
                        `Ya existe un proveedor con el nombre de contacto "${contactNameTrimmed}" en esta organización`
                    );
                }
            }
        }

        const mergedProps = {
            idType: updates.idType ?? existing.props.idType,
            idNumber: updates.idNumber ?? existing.props.idNumber,
            name: updates.name ?? existing.props.name,
            contactName: updates.contactName !== undefined ? updates.contactName : existing.props.contactName,
            email: updates.email !== undefined ? updates.email : existing.props.email,
            phone: updates.phone !== undefined ? updates.phone : existing.props.phone,
            address: updates.address !== undefined ? updates.address : existing.props.address,
            city: updates.city !== undefined ? updates.city : existing.props.city,
            department: updates.department !== undefined ? updates.department : existing.props.department,
            notes: updates.notes !== undefined ? updates.notes : existing.props.notes,
            organizationId,
            createdAt: existing.props.createdAt,
            updatedAt: new Date(),
        };

        const updatedSupplier = Supplier.create(mergedProps, id);
        await this.supplierRepository.save(updatedSupplier);
        await this.auditRecorder.recordIfUser(request.performedByUserId, {
            action: 'UPDATE',
            entity: 'Supplier',
            entityId: id,
            oldValues: { name: existing.props.name, idNumber: existing.props.idNumber, organizationId: existing.props.organizationId },
            newValues: { name: updatedSupplier.props.name, idNumber: updatedSupplier.props.idNumber, organizationId: updatedSupplier.props.organizationId },
            organizationId: updatedSupplier.props.organizationId,
        });
        return updatedSupplier;
    }
}

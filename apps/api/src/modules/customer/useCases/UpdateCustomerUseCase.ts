import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICustomerRepository } from '../domain/repositories/ICustomerRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { UpdateCustomerDTO } from '../dtos/customer.dtos';
import { Customer } from '../domain/entities/Customer';
import { AppError } from '../../../shared/errors/AppError';
import { CustomerRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';
import { AuditRecorder } from '../../../shared/audit/AuditRecorder';

@injectable()
export class UpdateCustomerUseCase implements UseCase<UpdateCustomerDTO, Customer> {
    constructor(
        @inject(CustomerRepositoryToken) private readonly customerRepository: ICustomerRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(AuditRecorder) private readonly auditRecorder: AuditRecorder
    ) {}

    async execute(request: UpdateCustomerDTO): Promise<Customer> {
        const { id, ...updates } = request;

        const existing = await this.customerRepository.findById(id);
        if (!existing) {
            throw new AppError('Cliente no encontrado', 404);
        }

        const organizationId = updates.organizationId ?? existing.props.organizationId;

        if (updates.organizationId) {
            const organization = await this.organizationRepository.findById(updates.organizationId);
            if (!organization) {
                throw new AppError('Organización no encontrada', 404);
            }
        }

        const idType = updates.idType ?? existing.props.idType;
        const idNumber = updates.idNumber ?? existing.props.idNumber;
        const identificationChanged =
            updates.idType !== undefined && updates.idType !== existing.props.idType ||
            updates.idNumber !== undefined && updates.idNumber !== existing.props.idNumber;
        if (identificationChanged) {
            const exists = await this.customerRepository.existsByIdTypeAndIdNumberAndOrganization(
                organizationId,
                idType,
                idNumber,
                id
            );
            if (exists) {
                throw new AppError(
                    `Ya existe un cliente con esta identificación (${idType} ${idNumber}) en esta organización`
                );
            }
        }

        const mergedProps = {
            idType: updates.idType ?? existing.props.idType,
            idNumber: updates.idNumber ?? existing.props.idNumber,
            dv: updates.dv !== undefined ? updates.dv : existing.props.dv,
            name: updates.name ?? existing.props.name,
            email: updates.email !== undefined ? updates.email : existing.props.email,
            phone: updates.phone !== undefined ? updates.phone : existing.props.phone,
            address: updates.address !== undefined ? updates.address : existing.props.address,
            city: updates.city !== undefined ? updates.city : existing.props.city,
            department: updates.department !== undefined ? updates.department : existing.props.department,
            taxRegime: updates.taxRegime ?? existing.props.taxRegime,
            fiscalResponsibilities:
                updates.fiscalResponsibilities !== undefined
                    ? updates.fiscalResponsibilities
                    : existing.props.fiscalResponsibilities,
            organizationId,
            createdAt: existing.props.createdAt,
            updatedAt: new Date(),
        };

        const updatedCustomer = Customer.create(mergedProps, id);
        await this.customerRepository.save(updatedCustomer);
        const orgId = updatedCustomer.props.organizationId;
        await this.auditRecorder.recordIfUser(request.performedByUserId, {
            action: 'UPDATE',
            entity: 'Customer',
            entityId: id,
            oldValues: { idType: existing.props.idType, idNumber: existing.props.idNumber, name: existing.props.name, organizationId: existing.props.organizationId },
            newValues: { idType: updatedCustomer.props.idType, idNumber: updatedCustomer.props.idNumber, name: updatedCustomer.props.name, organizationId: orgId },
            organizationId: orgId,
        });
        return updatedCustomer;
    }
}

import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IInvoiceResolutionRepository } from '../domain/repositories/IInvoiceResolutionRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { CreateInvoiceResolutionDTO } from '../dtos/invoiceResolution.dtos';
import { InvoiceResolution } from '../domain/entities/InvoiceResolution';
import { AppError } from '../../../shared/errors/AppError';
import { InvoiceResolutionRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';
import { AuditRecorder } from '../../../shared/audit/AuditRecorder';

/**
 * Crea una resolución de facturación.
 * Si la organización tiene usesDian = true, exige: resolutionNumber, startDate, endDate, technicalKey.
 * Si usesDian = false, esos campos son opcionales (numeración interna / tickets).
 */
@injectable()
export class CreateInvoiceResolutionUseCase implements UseCase<CreateInvoiceResolutionDTO, InvoiceResolution> {
    constructor(
        @inject(InvoiceResolutionRepositoryToken) private readonly resolutionRepository: IInvoiceResolutionRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(AuditRecorder) private readonly auditRecorder: AuditRecorder
    ) {}

    async execute(request: CreateInvoiceResolutionDTO): Promise<InvoiceResolution> {
        const organization = await this.organizationRepository.findById(request.organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }

        if (organization.props.usesDian) {
            if (!request.resolutionNumber?.trim()) {
                throw new AppError(
                    'La organización usa facturación electrónica DIAN. El número de resolución (resolutionNumber) es obligatorio.',
                    400
                );
            }
            if (request.startDate == null || request.startDate === undefined) {
                throw new AppError(
                    'La organización usa DIAN. La fecha de inicio de vigencia (startDate) es obligatoria.',
                    400
                );
            }
            if (request.endDate == null || request.endDate === undefined) {
                throw new AppError(
                    'La organización usa DIAN. La fecha de fin de vigencia (endDate) es obligatoria.',
                    400
                );
            }
            if (!request.technicalKey?.trim()) {
                throw new AppError(
                    'La organización usa DIAN. La clave técnica (technicalKey) es obligatoria para el CUFE.',
                    400
                );
            }
            if (request.startDate && request.endDate && request.startDate > request.endDate) {
                throw new AppError('La fecha de inicio no puede ser posterior a la fecha de fin.', 400);
            }
        }

        const currentNumber = request.currentNumber ?? request.rangeStart;
        const resolution = InvoiceResolution.create({
            name: request.name ?? null,
            resolutionNumber: request.resolutionNumber ?? null,
            prefix: request.prefix,
            rangeStart: request.rangeStart,
            rangeEnd: request.rangeEnd,
            currentNumber,
            startDate: request.startDate ?? null,
            endDate: request.endDate ?? null,
            technicalKey: request.technicalKey ?? null,
            isActive: request.isActive ?? true,
            organizationId: request.organizationId,
        });

        await this.resolutionRepository.save(resolution);
        await this.auditRecorder.recordIfUser(request.performedByUserId, {
            action: 'CREATE',
            entity: 'InvoiceResolution',
            entityId: resolution.id,
            newValues: { prefix: resolution.props.prefix, rangeStart: resolution.props.rangeStart, rangeEnd: resolution.props.rangeEnd, organizationId: resolution.props.organizationId },
            organizationId: resolution.props.organizationId,
        });
        return resolution;
    }
}

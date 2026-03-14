import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IInvoiceResolutionRepository } from '../domain/repositories/IInvoiceResolutionRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { UpdateInvoiceResolutionDTO } from '../dtos/invoiceResolution.dtos';
import { InvoiceResolution } from '../domain/entities/InvoiceResolution';
import { AppError } from '../../../shared/errors/AppError';
import { InvoiceResolutionRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

/**
 * Actualiza una resolución. Si la organización usa DIAN, no se pueden dejar vacíos
 * resolutionNumber, startDate, endDate ni technicalKey.
 */
@injectable()
export class UpdateInvoiceResolutionUseCase implements UseCase<UpdateInvoiceResolutionDTO, InvoiceResolution> {
    constructor(
        @inject(InvoiceResolutionRepositoryToken) private readonly resolutionRepository: IInvoiceResolutionRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(request: UpdateInvoiceResolutionDTO): Promise<InvoiceResolution> {
        const { id, ...updates } = request;

        const existing = await this.resolutionRepository.findById(id);
        if (!existing) {
            throw new AppError('Resolución de facturación no encontrada', 404);
        }

        const organizationId = updates.organizationId ?? existing.props.organizationId;
        const organization = await this.organizationRepository.findById(organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }

        if (organization.props.usesDian) {
            const resolutionNumber = updates.resolutionNumber !== undefined ? updates.resolutionNumber : existing.props.resolutionNumber;
            const startDate = updates.startDate !== undefined ? updates.startDate : existing.props.startDate;
            const endDate = updates.endDate !== undefined ? updates.endDate : existing.props.endDate;
            const technicalKey = updates.technicalKey !== undefined ? updates.technicalKey : existing.props.technicalKey;

            if (!resolutionNumber?.trim()) {
                throw new AppError('La organización usa DIAN. El número de resolución no puede quedar vacío.', 400);
            }
            if (startDate == null || startDate === undefined) {
                throw new AppError('La organización usa DIAN. La fecha de inicio de vigencia es obligatoria.', 400);
            }
            if (endDate == null || endDate === undefined) {
                throw new AppError('La organización usa DIAN. La fecha de fin de vigencia es obligatoria.', 400);
            }
            if (!technicalKey?.trim()) {
                throw new AppError('La organización usa DIAN. La clave técnica no puede quedar vacía.', 400);
            }
            if (startDate && endDate && startDate > endDate) {
                throw new AppError('La fecha de inicio no puede ser posterior a la fecha de fin.', 400);
            }
        }

        const mergedProps = {
            name: updates.name !== undefined ? updates.name : existing.props.name,
            resolutionNumber: updates.resolutionNumber !== undefined ? updates.resolutionNumber : existing.props.resolutionNumber,
            prefix: updates.prefix ?? existing.props.prefix,
            rangeStart: updates.rangeStart ?? existing.props.rangeStart,
            rangeEnd: updates.rangeEnd ?? existing.props.rangeEnd,
            currentNumber: updates.currentNumber !== undefined ? updates.currentNumber : existing.props.currentNumber,
            startDate: updates.startDate !== undefined ? updates.startDate : existing.props.startDate,
            endDate: updates.endDate !== undefined ? updates.endDate : existing.props.endDate,
            technicalKey: updates.technicalKey !== undefined ? updates.technicalKey : existing.props.technicalKey,
            isActive: updates.isActive !== undefined ? updates.isActive : existing.props.isActive,
            organizationId,
            createdAt: existing.props.createdAt,
            updatedAt: new Date(),
        };

        if (mergedProps.rangeStart > mergedProps.rangeEnd) {
            throw new AppError('rangeStart no puede ser mayor que rangeEnd.', 400);
        }
        if (mergedProps.currentNumber < mergedProps.rangeStart || mergedProps.currentNumber > mergedProps.rangeEnd) {
            throw new AppError('currentNumber debe estar entre rangeStart y rangeEnd.', 400);
        }

        const resolution = InvoiceResolution.create(mergedProps, id);
        await this.resolutionRepository.save(resolution);
        return resolution;
    }
}

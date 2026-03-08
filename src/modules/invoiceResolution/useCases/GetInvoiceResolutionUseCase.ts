import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IInvoiceResolutionRepository } from '../domain/repositories/IInvoiceResolutionRepository';
import { InvoiceResolution } from '../domain/entities/InvoiceResolution';
import { AppError } from '../../../shared/errors/AppError';
import { InvoiceResolutionRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetInvoiceResolutionUseCase implements UseCase<string, InvoiceResolution> {
    constructor(
        @inject(InvoiceResolutionRepositoryToken) private readonly resolutionRepository: IInvoiceResolutionRepository
    ) {}

    async execute(id: string): Promise<InvoiceResolution> {
        const resolution = await this.resolutionRepository.findById(id);
        if (!resolution) {
            throw new AppError('Resolución de facturación no encontrada', 404);
        }
        return resolution;
    }
}

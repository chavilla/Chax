import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { DianLog } from '../domain/entities/DianLog';
import { IDianLogRepository } from '../domain/repositories/IDianLogRepository';
import { DianLogRepositoryToken } from '../../../shared/container/tokens';

export interface GetDianLogsByOrganizationInput {
    organizationId: string;
    limit?: number;
}

@injectable()
export class GetDianLogsByOrganizationUseCase
    implements UseCase<GetDianLogsByOrganizationInput, DianLog[]>
{
    constructor(
        @inject(DianLogRepositoryToken)
        private readonly dianLogRepository: IDianLogRepository
    ) {}

    async execute(input: GetDianLogsByOrganizationInput): Promise<DianLog[]> {
        return this.dianLogRepository.findByOrganizationId(
            input.organizationId,
            input.limit
        );
    }
}

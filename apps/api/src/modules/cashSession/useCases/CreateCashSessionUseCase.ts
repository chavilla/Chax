import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICashSessionRepository } from '../domain/repositories/ICashSessionRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { IUserRepository } from '../../user/domain/repositories/IUserRepository';
import { CashSession } from '../domain/entities/CashSession';
import { AppError } from '../../../shared/errors/AppError';
import {
    CashSessionRepositoryToken,
    OrganizationRepositoryToken,
    UserRepositoryToken,
} from '../../../shared/container/tokens';
import { AuditRecorder } from '../../../shared/audit/AuditRecorder';
import type { CreateCashSessionDTO } from '../dtos/cashSession.dtos';

@injectable()
export class CreateCashSessionUseCase implements UseCase<CreateCashSessionDTO, CashSession> {
    constructor(
        @inject(CashSessionRepositoryToken) private readonly cashSessionRepository: ICashSessionRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(UserRepositoryToken) private readonly userRepository: IUserRepository,
        @inject(AuditRecorder) private readonly auditRecorder: AuditRecorder
    ) {}

    async execute(request: CreateCashSessionDTO): Promise<CashSession> {
        const organization = await this.organizationRepository.findById(request.organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }

        const user = await this.userRepository.findById(request.userId);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }
        if (user.props.organizationId !== request.organizationId) {
            throw new AppError('El usuario no pertenece a esta organización', 400);
        }

        const session = CashSession.create({
            openingAmount: request.openingAmount,
            openedAt: new Date(),
            isClosed: false,
            userId: request.userId,
            organizationId: request.organizationId,
            notes: request.notes ?? null,
        });

        await this.cashSessionRepository.save(session);
        await this.auditRecorder.recordIfUser(request.userId, {
            action: 'CREATE',
            entity: 'CashSession',
            entityId: session.id,
            newValues: { openingAmount: session.props.openingAmount, userId: session.props.userId, organizationId: session.props.organizationId },
            organizationId: session.props.organizationId,
        });
        return session;
    }
}

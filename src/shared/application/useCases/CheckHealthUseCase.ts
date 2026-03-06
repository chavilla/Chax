import { injectable, inject } from 'tsyringe';
import { DatabaseRepository } from '../../domain/repositories/DatabaseRepository';
import { DatabaseRepositoryToken } from '../../container/tokens';

@injectable()
export class CheckHealthUseCase {
    constructor(
        @inject(DatabaseRepositoryToken) private readonly databaseRepository: DatabaseRepository
    ) {}

    async execute(): Promise<{ status: string; database: string; error?: string }> {
        try {
            const isDbConnected = await this.databaseRepository.checkConnection();
            return {
                status: isDbConnected ? 'OK' : 'ERROR',
                database: isDbConnected ? 'Connected' : 'Disconnected',
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return {
                status: 'ERROR',
                database: 'Disconnected',
                ...(process.env.NODE_ENV !== 'production' && { error: message }),
            };
        }
    }
}

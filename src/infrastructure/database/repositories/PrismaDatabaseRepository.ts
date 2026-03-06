import { injectable } from 'tsyringe';
import { DatabaseRepository } from '../../../shared/domain/repositories/DatabaseRepository';
import { prisma } from '../prisma';

@injectable()
export class PrismaDatabaseRepository implements DatabaseRepository {
    async checkConnection(): Promise<boolean> {
        try {
            await prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            console.error('Database connection error:', error);
            throw error; // Re-lanzar para que el health check pueda mostrar el mensaje
        }
    }
}

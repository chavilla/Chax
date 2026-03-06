import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CheckHealthUseCase } from '../../../shared/application/useCases/CheckHealthUseCase';

@injectable()
export class HealthController {
    constructor(private readonly checkHealthUseCase: CheckHealthUseCase) {}

    async check(req: Request, res: Response): Promise<void> {
        const healthStatus = await this.checkHealthUseCase.execute();

        if (healthStatus.status === 'ERROR' || healthStatus.database === 'Disconnected') {
            res.status(503).json(healthStatus);
            return;
        }

        res.status(200).json(healthStatus);
    }
}

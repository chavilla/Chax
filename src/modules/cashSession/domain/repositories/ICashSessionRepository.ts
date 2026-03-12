import { CashSession } from '../entities/CashSession';

export interface CloseCashSessionData {
    closingAmount: number;
    expectedAmount?: number | null;
    difference?: number | null;
    totalCash?: number | null;
    totalCard?: number | null;
    totalTransfer?: number | null;
    notes?: string | null;
}

export interface ICashSessionRepository {
    save(session: CashSession): Promise<void>;
    findById(id: string): Promise<CashSession | null>;
    findAllByOrganization(organizationId: string, options?: { isClosed?: boolean }): Promise<CashSession[]>;
    update(session: CashSession): Promise<void>;
}

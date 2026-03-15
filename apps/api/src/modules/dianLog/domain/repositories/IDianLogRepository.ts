import { DianLog } from '../entities/DianLog';

export interface IDianLogRepository {
    findById(id: string): Promise<DianLog | null>;
    findByInvoiceId(invoiceId: string): Promise<DianLog[]>;
    findByOrganizationId(organizationId: string, limit?: number): Promise<DianLog[]>;
}

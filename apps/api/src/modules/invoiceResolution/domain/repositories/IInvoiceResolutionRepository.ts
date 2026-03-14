import { InvoiceResolution } from '../entities/InvoiceResolution';

export interface IInvoiceResolutionRepository {
    save(resolution: InvoiceResolution): Promise<void>;
    findById(id: string): Promise<InvoiceResolution | null>;
    findAllByOrganization(organizationId: string): Promise<InvoiceResolution[]>;
}

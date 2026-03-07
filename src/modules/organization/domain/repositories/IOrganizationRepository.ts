import { Organization } from '../entities/Organization';

export interface IOrganizationRepository {
    exists(nit: string): Promise<boolean>;
    save(organization: Organization): Promise<void>;
    findById(id: string): Promise<Organization | null>;
    findByNit(nit: string): Promise<Organization | null>;
    findAll(): Promise<Organization[]>;
}

import { Supplier } from '../entities/Supplier';

export interface ISupplierRepository {
    existsByIdNumberAndOrganization(
        organizationId: string,
        idNumber: string,
        excludeId?: string
    ): Promise<boolean>;
    existsByNameAndOrganization(
        organizationId: string,
        name: string,
        excludeId?: string
    ): Promise<boolean>;
    existsByContactNameAndOrganization(
        organizationId: string,
        contactName: string,
        excludeId?: string
    ): Promise<boolean>;
    save(supplier: Supplier): Promise<void>;
    findById(id: string): Promise<Supplier | null>;
    findAllByOrganization(organizationId: string): Promise<Supplier[]>;
    findAll(): Promise<Supplier[]>;
}

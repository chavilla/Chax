import { Customer } from '../entities/Customer';

export interface ICustomerRepository {
    existsByIdTypeAndIdNumberAndOrganization(
        organizationId: string,
        idType: string,
        idNumber: string,
        excludeId?: string
    ): Promise<boolean>;
    save(customer: Customer): Promise<void>;
    findById(id: string): Promise<Customer | null>;
    findAllByOrganization(organizationId: string): Promise<Customer[]>;
    findAll(): Promise<Customer[]>;
}

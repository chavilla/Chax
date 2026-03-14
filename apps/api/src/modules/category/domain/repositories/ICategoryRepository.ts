import { Category } from '../entities/Category';

export interface ICategoryRepository {
    existsByNameAndOrganization(organizationId: string, name: string, excludeId?: string): Promise<boolean>;
    save(category: Category): Promise<void>;
    findById(id: string): Promise<Category | null>;
    findAllByOrganization(organizationId: string): Promise<Category[]>;
}

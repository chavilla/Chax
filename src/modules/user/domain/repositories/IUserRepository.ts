import { User } from '../entities/User';

export interface IUserRepository {
    existsByEmail(email: string): Promise<boolean>;
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAllByOrganization(organizationId: string): Promise<User[]>;
    findAll(): Promise<User[]>;
}

import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { ICustomerRepository } from '../domain/repositories/ICustomerRepository';
import { Customer } from '../domain/entities/Customer';
import { CustomerRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetAllCustomersUseCase implements UseCase<void, Customer[]> {
    constructor(
        @inject(CustomerRepositoryToken) private readonly customerRepository: ICustomerRepository
    ) {}

    async execute(): Promise<Customer[]> {
        return this.customerRepository.findAll();
    }
}

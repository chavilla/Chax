import { Product } from '../entities/Product';

export interface IProductRepository {
    getNextSequenceForPrefix(organizationId: string, prefix: string): Promise<number>;
    existsByInternalCodeAndOrganization(
        organizationId: string,
        internalCode: string,
        excludeId?: string
    ): Promise<boolean>;
    existsByBarcodeAndOrganization(
        organizationId: string,
        barcode: string,
        excludeId?: string
    ): Promise<boolean>;
    existsByNameAndOrganization(
        organizationId: string,
        name: string,
        excludeId?: string
    ): Promise<boolean>;
    save(product: Product): Promise<void>;
    findById(id: string): Promise<Product | null>;
    findAllByOrganization(organizationId: string): Promise<Product[]>;
    countDependencies(productId: string): Promise<{ invoiceItems: number; stockMovements: number }>;
    delete(id: string): Promise<void>;
}

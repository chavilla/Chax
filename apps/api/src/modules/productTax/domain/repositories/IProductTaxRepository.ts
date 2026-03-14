import { ProductTax } from '../entities/ProductTax';

export interface IProductTaxRepository {
    save(productTax: ProductTax): Promise<void>;
    findById(id: string): Promise<ProductTax | null>;
    findByProductId(productId: string): Promise<ProductTax[]>;
    update(productTax: ProductTax): Promise<void>;
    delete(id: string): Promise<void>;
}

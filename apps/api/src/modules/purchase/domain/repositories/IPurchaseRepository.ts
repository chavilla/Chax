import { Purchase } from '../entities/Purchase';

export interface PurchaseItemToPersist {
    productId: string;
    quantity: number;
    unitCost: number;
    subtotal: number;
}

export interface PurchaseItemWithId extends PurchaseItemToPersist {
    id: string;
    purchaseId: string;
}

export interface CreatePurchaseData {
    purchase: Purchase;
    items: PurchaseItemToPersist[];
    productStockUpdates: { productId: string; newStock: number; newCostPrice: number }[];
    stockMovements: {
        productId: string;
        quantity: number;
        previousStock: number;
        newStock: number;
        unitCost: number;
        supplierId: string;
        organizationId: string;
        reference?: string | null;
    }[];
}

export interface IPurchaseRepository {
    createWithItemsAndStock(data: CreatePurchaseData): Promise<Purchase>;
    findById(id: string): Promise<Purchase | null>;
    findByIdWithItems(id: string): Promise<{ purchase: Purchase; items: PurchaseItemWithId[] } | null>;
    findAllByOrganization(organizationId: string): Promise<Purchase[]>;
}

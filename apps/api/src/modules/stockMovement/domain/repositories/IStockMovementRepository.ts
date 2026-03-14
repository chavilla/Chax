export type StockMovementType =
    | 'VENTA'
    | 'COMPRA'
    | 'AJUSTE_ENTRADA'
    | 'AJUSTE_SALIDA'
    | 'DEVOLUCION'
    | 'PERDIDA';

export interface KardexRow {
    id: string;
    type: StockMovementType;
    quantity: number;
    previousStock: number;
    newStock: number;
    unitCost: number | null;
    reason: string | null;
    reference: string | null;
    productId: string;
    supplierId: string | null;
    organizationId: string;
    createdAt: Date;
}

export interface FindByProductOptions {
    from?: Date;
    to?: Date;
}

export interface IStockMovementRepository {
    findByProduct(productId: string, options?: FindByProductOptions): Promise<KardexRow[]>;
}

export interface PurchaseProps {
  supplierId: string;
  organizationId: string;
  purchaseDate: Date;
  reference?: string | null;
  notes?: string | null;
  total: number;
}

/** Forma de Purchase en respuestas API / frontend */
export interface Purchase extends PurchaseProps {
  id: string;
}

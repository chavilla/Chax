import type { TaxType } from '../../enums';

export interface ProductProps {
  internalCode: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  salePrice: number;
  costPrice: number;
  unitOfMeasure: string;
  taxType: TaxType;
  taxPercentage: number;
  stock: number;
  minStock: number;
  isActive: boolean;
  categoryId?: string | null;
  organizationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Forma de Product en respuestas API / frontend */
export interface Product extends ProductProps {
  id: string;
}

import type { TaxType } from '../../enums';

export interface ProductTaxProps {
  productId: string;
  taxType: TaxType;
  percentage: number;
  fixedAmount?: number | null;
  createdAt?: Date;
}

/** Forma de ProductTax en respuestas API / frontend */
export interface ProductTax extends ProductTaxProps {
  id: string;
}

import type { IdType, TaxRegime } from '../../enums';

export interface CustomerProps {
  idType: IdType;
  idNumber: string;
  dv?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  department?: string | null;
  taxRegime: TaxRegime;
  fiscalResponsibilities?: string | null;
  organizationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Forma de Customer en respuestas API / frontend */
export interface Customer extends CustomerProps {
  id: string;
}

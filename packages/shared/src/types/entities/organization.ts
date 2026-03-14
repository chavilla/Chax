import type { TaxRegime } from '../../enums';

export interface OrganizationProps {
  nit: string;
  dv?: string;
  businessName: string;
  tradeName?: string;
  address: string;
  city: string;
  department: string;
  phone?: string;
  email: string;
  economicActivityCode?: string;
  taxRegime: TaxRegime;
  usesDian: boolean;
  logoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Forma de Organization en respuestas API / frontend */
export interface Organization extends OrganizationProps {
  id: string;
}

/**
 * DTOs compartidos: formas de datos para crear/actualizar entidades.
 * El frontend los usa para tipar requests; la API mantiene Zod para validación.
 */
import type {
  TaxRegime,
  TaxType,
  IdType,
  UserRole,
  InvoiceType,
  PaymentMethod,
  ExpenseCategory,
} from '../enums';

// --- Organization ---
export interface CreateOrganizationDTO {
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
  taxRegime?: TaxRegime;
  usesDian?: boolean;
  logoUrl?: string;
}

export interface UpdateOrganizationDTO extends Partial<CreateOrganizationDTO> {
  id: string;
}

// --- Category ---
export interface CreateCategoryDTO {
  name: string;
  description?: string;
  organizationId: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
  id: string;
}

// --- Product ---
export interface CreateProductDTO {
  internalCode?: string;
  internalCodePrefix?: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  salePrice: number;
  costPrice?: number;
  unitOfMeasure?: string;
  taxType?: TaxType;
  taxPercentage?: number;
  stock?: number;
  minStock?: number;
  isActive?: boolean;
  categoryId?: string | null;
  organizationId: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}

// --- ProductTax ---
export interface CreateProductTaxDTO {
  productId: string;
  taxType: TaxType;
  percentage: number;
  fixedAmount?: number | null;
}

export interface UpdateProductTaxDTO extends Partial<CreateProductTaxDTO> {
  id: string;
}

// --- Customer ---
export interface CreateCustomerDTO {
  idType?: IdType;
  idNumber: string;
  dv?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  department?: string | null;
  taxRegime?: TaxRegime;
  fiscalResponsibilities?: string | null;
  organizationId: string;
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {
  id: string;
}

// --- User ---
export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  isActive?: boolean;
  organizationId?: string | null;
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {
  id: string;
}

// --- Supplier ---
export interface CreateSupplierDTO {
  idType: IdType;
  idNumber: string;
  name: string;
  contactName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  department?: string | null;
  notes?: string | null;
  organizationId: string;
}

export interface UpdateSupplierDTO extends Partial<CreateSupplierDTO> {
  id: string;
}

// --- Invoice ---
/** Desglose de impuesto por línea (DIAN). Opcional al crear ítem de factura. */
export interface InvoiceItemTaxBreakdownInput {
  dianCode: string;
  taxBase: number;
  taxPercentage: number;
  taxAmount: number;
}

export interface CreateInvoiceItemInput {
  productId: string;
  quantity: number;
  unitPrice?: number;
  discount?: number;
  taxPercentage?: number;
  taxBreakdown?: InvoiceItemTaxBreakdownInput[];
}

// --- InvoiceItemTax ---
export interface CreateInvoiceItemTaxDTO {
  invoiceItemId: string;
  dianCode: string;
  taxBase: number;
  taxPercentage: number;
  taxAmount: number;
}

export interface CreateInvoicePaymentInput {
  amount: number;
  paymentMethod?: PaymentMethod;
  reference?: string | null;
}

export interface CreateInvoiceDTO {
  organizationId: string;
  customerId: string;
  createdByUserId: string;
  resolutionId?: string | null;
  type?: InvoiceType;
  notes?: string | null;
  dueDate?: Date | null;
  cashSessionId?: string | null;
  items: CreateInvoiceItemInput[];
  payments?: CreateInvoicePaymentInput[];
}

export interface RegisterPaymentDTO {
  invoiceId: string;
  amount: number;
  paymentMethod?: PaymentMethod;
  reference?: string | null;
}

// --- Expense ---
export interface CreateExpenseDTO {
  organizationId: string;
  category?: ExpenseCategory;
  description: string;
  amount: number;
  expenseDate?: Date;
  reference?: string | null;
  notes?: string | null;
}

// --- CashSession ---
export interface CreateCashSessionDTO {
  organizationId: string;
  userId: string;
  openingAmount: number;
  notes?: string | null;
}

export interface CloseCashSessionDTO {
  id: string;
  closingAmount: number;
  expectedAmount?: number | null;
  difference?: number | null;
  totalCash?: number | null;
  totalCard?: number | null;
  totalTransfer?: number | null;
  notes?: string | null;
}

// --- Purchase ---
export interface CreatePurchaseItemInput {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseDTO {
  organizationId: string;
  supplierId: string;
  purchaseDate?: Date;
  reference?: string | null;
  notes?: string | null;
  items: CreatePurchaseItemInput[];
}

// --- InvoiceResolution ---
export interface CreateInvoiceResolutionDTO {
  name?: string | null;
  resolutionNumber?: string | null;
  prefix: string;
  rangeStart: number;
  rangeEnd: number;
  currentNumber?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  technicalKey?: string | null;
  isActive?: boolean;
  organizationId: string;
}

export interface UpdateInvoiceResolutionDTO extends Partial<CreateInvoiceResolutionDTO> {
  id: string;
}

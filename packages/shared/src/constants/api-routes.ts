/**
 * Rutas base de la API. Usar en el frontend para construir URLs
 * y en el backend como referencia de rutas expuestas.
 */
export const API_ROUTES = {
  HEALTH: '/health',
  ORGANIZATIONS: '/api/organizations',
  USERS: '/api/users',
  CATEGORIES: '/api/categories',
  CUSTOMERS: '/api/customers',
  PRODUCTS: '/api/products',
  SUPPLIERS: '/api/suppliers',
  INVOICE_RESOLUTIONS: '/api/invoice-resolutions',
  INVOICES: '/api/invoices',
  CASH_SESSIONS: '/api/cash-sessions',
  EXPENSES: '/api/expenses',
  PURCHASES: '/api/purchases',
  STOCK_MOVEMENTS: '/api/stock-movements',
} as const;

export type ApiRouteKey = keyof typeof API_ROUTES;

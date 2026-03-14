/**
 * Enums compartidos (espejo de Prisma) para usar en API y Web
 * sin depender de @prisma/client en el frontend.
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  ACCOUNTANT = 'ACCOUNTANT',
}

export enum IdType {
  CC = 'CC',
  NIT = 'NIT',
  CE = 'CE',
  TI = 'TI',
  PP = 'PP',
  DIE = 'DIE',
}

export enum TaxRegime {
  RESPONSABLE_IVA = 'RESPONSABLE_IVA',
  NO_RESPONSABLE_IVA = 'NO_RESPONSABLE_IVA',
}

export enum TaxType {
  IVA = 'IVA',
  IC = 'IC',
  ICA = 'ICA',
  INC = 'INC',
  EXCLUIDO = 'EXCLUIDO',
  EXENTO = 'EXENTO',
  RETEIVA = 'RETEIVA',
  RETEFUENTE = 'RETEFUENTE',
}

export enum InvoiceType {
  FACTURA = 'FACTURA',
  NOTA_CREDITO = 'NOTA_CREDITO',
  NOTA_DEBITO = 'NOTA_DEBITO',
  POS = 'POS',
}

export enum DianStatus {
  PENDIENTE = 'PENDIENTE',
  ENVIADA = 'ENVIADA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  NO_APLICA = 'NO_APLICA',
}

export enum PaymentStatus {
  PENDIENTE = 'PENDIENTE',
  PARCIAL = 'PARCIAL',
  PAGADA = 'PAGADA',
  ANULADA = 'ANULADA',
}

export enum PaymentMethod {
  EFECTIVO = 'EFECTIVO',
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  NEQUI = 'NEQUI',
  DAVIPLATA = 'DAVIPLATA',
  OTRO = 'OTRO',
}

export enum StockMovementType {
  VENTA = 'VENTA',
  COMPRA = 'COMPRA',
  AJUSTE_ENTRADA = 'AJUSTE_ENTRADA',
  AJUSTE_SALIDA = 'AJUSTE_SALIDA',
  DEVOLUCION = 'DEVOLUCION',
  PERDIDA = 'PERDIDA',
}

export enum ExpenseCategory {
  ARRIENDO = 'ARRIENDO',
  SERVICIOS_PUBLICOS = 'SERVICIOS_PUBLICOS',
  NOMINA = 'NOMINA',
  IMPUESTOS = 'IMPUESTOS',
  INSUMOS = 'INSUMOS',
  TRANSPORTE = 'TRANSPORTE',
  MARKETING = 'MARKETING',
  MANTENIMIENTO = 'MANTENIMIENTO',
  OTRO = 'OTRO',
}

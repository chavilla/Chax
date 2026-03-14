/**
 * Calcula subtotal, taxAmount y total de una línea de factura.
 * subtotal = quantity * unitPrice - discount
 * taxAmount = subtotal * (taxPercentage / 100)
 * total = subtotal + taxAmount
 */
export function calculateInvoiceItemTotals(params: {
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxPercentage?: number;
}): { subtotal: number; taxAmount: number; total: number } {
  const { quantity, unitPrice, discount = 0, taxPercentage = 0 } = params;
  if (quantity <= 0) throw new Error('La cantidad debe ser mayor a 0');
  if (unitPrice < 0) throw new Error('El precio unitario no puede ser negativo');
  if (discount < 0) throw new Error('El descuento no puede ser negativo');

  const subtotal = Number((quantity * unitPrice - discount).toFixed(2));
  const taxAmount = Number((subtotal * (taxPercentage / 100)).toFixed(2));
  const total = Number((subtotal + taxAmount).toFixed(2));

  return { subtotal, taxAmount, total };
}

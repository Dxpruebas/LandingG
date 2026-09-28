// Contrato de la integración con Dropi (fase 10).
// La API de Dropi no está documentada públicamente: confirmar los endpoints
// reales antes de implementar este adaptador.

export interface DropiProduct {
  id: string;
  name: string;
  imageUrls: string[];
  supplierPrice: number;
  suggestedPrice: number;
  currency: string;
}

export interface DropiOrderInput {
  productId: string;
  quantity: number;
  customerName: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  neighborhood?: string;
  notes?: string;
  totalPrice: number;
}

export interface DropiAdapter {
  searchProducts(query: string): Promise<DropiProduct[]>;
  getProduct(id: string): Promise<DropiProduct | null>;
  createOrder(order: DropiOrderInput): Promise<{ dropiOrderId: string }>;
}

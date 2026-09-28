// Contrato de la pasarela de pagos (se implementa en la fase 13).
// Mientras tanto, los créditos se cargan desde el panel de administrador.

export type PurchaseItem =
  | { type: "plan"; planId: string; billing: "monthly" | "yearly" }
  | { type: "pack"; packId: string };

export type PaymentEvent =
  | { type: "payment_succeeded"; userId: string; item: PurchaseItem; amountUsd: number; externalId: string }
  | { type: "subscription_renewed"; userId: string; planId: string; externalId: string }
  | { type: "subscription_canceled"; userId: string; externalId: string };

export interface PaymentProvider {
  readonly name: string;
  createCheckout(input: {
    userId: string;
    email: string;
    item: PurchaseItem;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ checkoutUrl: string }>;
  // Valida la firma del aviso de la pasarela y lo traduce a un evento de la app.
  parseWebhook(request: Request): Promise<PaymentEvent | null>;
  cancelSubscription(externalSubscriptionId: string): Promise<void>;
}

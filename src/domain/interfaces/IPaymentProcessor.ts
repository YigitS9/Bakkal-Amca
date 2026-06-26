import type { Order } from "@/domain/models/Order";
import type { PaymentResult } from "@/types/dto";

export interface IPaymentProcessor {
  processPayment(order: Order): PaymentResult;
}

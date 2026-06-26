import { PaymentMethod, PaymentStatus } from "@prisma/client";
import type { IPaymentProcessor } from "@/domain/interfaces/IPaymentProcessor";
import type { Order } from "@/domain/models/Order";
import type { PaymentResult } from "@/types/dto";

export class CashOnDeliveryPayment implements IPaymentProcessor {
  public processPayment(_order: Order): PaymentResult {
    return {
      success: true,
      status: PaymentStatus.CASH_ON_DELIVERY,
      method: PaymentMethod.CASH_ON_DELIVERY,
      message: "Payment will be collected on delivery."
    };
  }
}

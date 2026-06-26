import { PaymentMethod, PaymentStatus } from "@prisma/client";
import type { IPaymentProcessor } from "@/domain/interfaces/IPaymentProcessor";
import type { Order } from "@/domain/models/Order";
import type { PaymentResult } from "@/types/dto";

export class FakeCreditCardPayment implements IPaymentProcessor {
  public processPayment(order: Order): PaymentResult {
    if (order.getTotalAmount() <= 0) {
      return {
        success: false,
        status: PaymentStatus.FAILED,
        method: PaymentMethod.FAKE_CREDIT_CARD,
        message: "Fake card payment failed because the order total is invalid."
      };
    }

    return {
      success: true,
      status: PaymentStatus.PAID,
      method: PaymentMethod.FAKE_CREDIT_CARD,
      message: "Fake credit card payment approved."
    };
  }
}

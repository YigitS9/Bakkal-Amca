import { OrderStatus, PaymentMethod, UserRole } from "@prisma/client";
import { CashOnDeliveryPayment } from "@/domain/payments/CashOnDeliveryPayment";
import { FakeCreditCardPayment } from "@/domain/payments/FakeCreditCardPayment";
import type { IPaymentProcessor } from "@/domain/interfaces/IPaymentProcessor";
import { Order } from "@/domain/models/Order";
import { OrderItem } from "@/domain/models/OrderItem";
import { ForbiddenError } from "@/exceptions/ForbiddenError";
import { InsufficientStockError } from "@/exceptions/InsufficientStockError";
import { NotFoundError } from "@/exceptions/NotFoundError";
import { ValidationError } from "@/exceptions/ValidationError";
import { prisma } from "@/lib/prisma";
import { OrderRepository } from "@/repositories/OrderRepository";

export class OrderService {
  private readonly orders = new OrderRepository();

  public async checkout(userId: string, paymentMethod: PaymentMethod) {
    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } }
      });

      if (!cart || cart.items.length === 0) {
        throw new ValidationError("Cart cannot be empty.");
      }

      const orderItems = cart.items.map((item) => {
        if (!item.product.isAvailable) {
          throw new NotFoundError(`Product ${item.product.name} is no longer available.`);
        }

        if (item.quantity > item.product.stockQuantity) {
          throw new InsufficientStockError(`Not enough stock for ${item.product.name}.`);
        }

        return new OrderItem(item.product.name, item.product.price, item.quantity);
      });

      const domainOrder = new Order("pending", userId, orderItems);
      const processor = this.getPaymentProcessor(paymentMethod);
      const paymentResult = processor.processPayment(domainOrder);

      if (!paymentResult.success) {
        throw new ValidationError(paymentResult.message);
      }

      const createdOrder = await tx.order.create({
        data: {
          userId,
          paymentMethod,
          paymentStatus: paymentResult.status,
          totalAmount: domainOrder.getTotalAmount(),
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productImageUrl: item.product.imageUrl,
              unitPrice: item.product.price,
              quantity: item.quantity,
              lineTotal: Number((item.product.price * item.quantity).toFixed(2))
            }))
          }
        },
        include: { items: true }
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } }
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return createdOrder;
    });
  }

  public getMyOrders(userId: string) {
    return this.orders.findManyByUserId(userId);
  }

  public async getOrderById(orderId: string, requester: { id: string; role: UserRole }) {
    const order = await this.orders.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    if (requester.role !== UserRole.ADMIN && order.userId !== requester.id) {
      throw new ForbiddenError();
    }

    return order;
  }

  public getAllOrders() {
    return this.orders.findAll();
  }

  public async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.orders.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    return this.orders.updateStatus(orderId, status);
  }

  public count() {
    return this.orders.count();
  }

  public recent(limit = 5) {
    return this.orders.recent(limit);
  }

  private getPaymentProcessor(paymentMethod: PaymentMethod): IPaymentProcessor {
    switch (paymentMethod) {
      case PaymentMethod.CASH_ON_DELIVERY:
        return new CashOnDeliveryPayment();
      case PaymentMethod.FAKE_CREDIT_CARD:
        return new FakeCreditCardPayment();
      default:
        throw new ValidationError("Unsupported payment method.");
    }
  }
}

import type { Product } from "./Product";

export class CartItem {
  private readonly product: Product;
  private quantity: number;

  public constructor(product: Product, quantity: number) {
    if (quantity <= 0) {
      throw new Error("Cart item quantity must be greater than zero.");
    }

    if (quantity > product.getStockQuantity()) {
      throw new Error("Cart item quantity cannot exceed available stock.");
    }

    this.product = product;
    this.quantity = quantity;
  }

  public getProduct(): Product {
    return this.product;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public updateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Cart item quantity must be greater than zero.");
    }

    if (quantity > this.product.getStockQuantity()) {
      throw new Error("Cart item quantity cannot exceed available stock.");
    }

    this.quantity = quantity;
  }

  public getLineTotal(): number {
    return Number((this.product.getFinalPrice() * this.quantity).toFixed(2));
  }
}

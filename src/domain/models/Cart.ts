import { CartItem } from "./CartItem";
import type { Product } from "./Product";

export class Cart {
  private readonly items: CartItem[] = [];

  public addItem(product: Product, quantity: number): void {
    const existingItem = this.items.find((item) => item.getProduct().getId() === product.getId());

    if (existingItem) {
      existingItem.updateQuantity(existingItem.getQuantity() + quantity);
      return;
    }

    this.items.push(new CartItem(product, quantity));
  }

  public getItems(): CartItem[] {
    return [...this.items];
  }

  public getTotal(): number {
    return Number(this.items.reduce((total, item) => total + item.getLineTotal(), 0).toFixed(2));
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }
}

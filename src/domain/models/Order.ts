import { OrderItem } from "./OrderItem";

export class Order {
  private readonly id: string;
  private readonly userId: string;
  private readonly items: OrderItem[];

  public constructor(id: string, userId: string, items: OrderItem[]) {
    if (items.length === 0) {
      throw new Error("Order must contain at least one item.");
    }

    this.id = id;
    this.userId = userId;
    this.items = items;
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getItems(): OrderItem[] {
    return [...this.items];
  }

  public getTotalAmount(): number {
    return Number(this.items.reduce((total, item) => total + item.getLineTotal(), 0).toFixed(2));
  }
}

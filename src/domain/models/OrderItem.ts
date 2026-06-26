export class OrderItem {
  private readonly productName: string;
  private readonly unitPrice: number;
  private readonly quantity: number;

  public constructor(productName: string, unitPrice: number, quantity: number) {
    if (unitPrice <= 0 || quantity <= 0) {
      throw new Error("Order item price and quantity must be greater than zero.");
    }

    this.productName = productName;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
  }

  public getProductName(): string {
    return this.productName;
  }

  public getUnitPrice(): number {
    return this.unitPrice;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getLineTotal(): number {
    return Number((this.unitPrice * this.quantity).toFixed(2));
  }
}

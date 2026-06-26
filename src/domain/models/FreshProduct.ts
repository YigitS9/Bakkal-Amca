import { Product } from "./Product";

export class FreshProduct extends Product {
  private readonly expirationDate?: Date;
  private readonly originCountry?: string;

  public constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    stockQuantity: number,
    categoryId: string,
    expirationDate?: Date,
    originCountry?: string
  ) {
    super(id, name, description, price, stockQuantity, categoryId);
    this.expirationDate = expirationDate;
    this.originCountry = originCountry;
  }

  public getExpirationDate(): Date | undefined {
    return this.expirationDate;
  }

  public getOriginCountry(): string | undefined {
    return this.originCountry;
  }

  public getStorageInstructions(): string {
    return "Keep refrigerated and consume before the expiration date.";
  }

  public override getFinalPrice(): number {
    if (!this.expirationDate) {
      return this.getPrice();
    }

    const daysUntilExpiration =
      (this.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

    return daysUntilExpiration <= 2 ? Number((this.getPrice() * 0.8).toFixed(2)) : this.getPrice();
  }
}

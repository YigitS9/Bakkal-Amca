import { Product } from "./Product";

export class FrozenProduct extends Product {
  private readonly requiredTemperature: number;

  public constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    stockQuantity: number,
    categoryId: string,
    requiredTemperature = -18
  ) {
    super(id, name, description, price, stockQuantity, categoryId);
    this.requiredTemperature = requiredTemperature;
  }

  public getRequiredTemperature(): number {
    return this.requiredTemperature;
  }

  public getStorageInstructions(): string {
    return `Keep frozen at ${this.requiredTemperature}C or below.`;
  }
}

import { Product } from "./Product";

export class PackagedProduct extends Product {
  private readonly brand?: string;
  private readonly barcode?: string;

  public constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    stockQuantity: number,
    categoryId: string,
    brand?: string,
    barcode?: string
  ) {
    super(id, name, description, price, stockQuantity, categoryId);
    this.brand = brand;
    this.barcode = barcode;
  }

  public getBrand(): string | undefined {
    return this.brand;
  }

  public getBarcode(): string | undefined {
    return this.barcode;
  }

  public getStorageInstructions(): string {
    return "Store in a cool, dry place away from direct sunlight.";
  }
}

import type { IDiscountable } from "@/domain/interfaces/IDiscountable";
import type { IStockManageable } from "@/domain/interfaces/IStockManageable";

export abstract class Product implements IStockManageable, IDiscountable {
  private readonly id: string;
  private name: string;
  private description: string;
  private price: number;
  private stockQuantity: number;
  private categoryId: string;

  protected constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    stockQuantity: number,
    categoryId: string
  ) {
    if (price <= 0) {
      throw new Error("Product price must be greater than zero.");
    }

    if (stockQuantity < 0) {
      throw new Error("Stock quantity cannot be negative.");
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stockQuantity = stockQuantity;
    this.categoryId = categoryId;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPrice(): number {
    return this.price;
  }

  public getStockQuantity(): number {
    return this.stockQuantity;
  }

  public getCategoryId(): string {
    return this.categoryId;
  }

  public reduceStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }

    if (quantity > this.stockQuantity) {
      throw new Error("Not enough stock available.");
    }

    this.stockQuantity -= quantity;
  }

  public increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }

    this.stockQuantity += quantity;
  }

  public getFinalPrice(): number {
    return this.price;
  }

  public abstract getStorageInstructions(): string;
}

import { ProductType, type Product as PrismaProduct } from "@prisma/client";
import { FreshProduct } from "@/domain/models/FreshProduct";
import { FrozenProduct } from "@/domain/models/FrozenProduct";
import { PackagedProduct } from "@/domain/models/PackagedProduct";
import type { Product } from "@/domain/models/Product";

export class ProductFactory {
  public static create(product: PrismaProduct): Product {
    switch (product.productType) {
      case ProductType.FRESH:
        return new FreshProduct(
          product.id,
          product.name,
          product.description,
          product.price,
          product.stockQuantity,
          product.categoryId,
          product.expirationDate ?? undefined,
          product.originCountry ?? undefined
        );
      case ProductType.FROZEN:
        return new FrozenProduct(
          product.id,
          product.name,
          product.description,
          product.price,
          product.stockQuantity,
          product.categoryId,
          product.requiredTemperature ?? -18
        );
      case ProductType.PACKAGED:
        return new PackagedProduct(
          product.id,
          product.name,
          product.description,
          product.price,
          product.stockQuantity,
          product.categoryId,
          product.brand ?? undefined,
          product.barcode ?? undefined
        );
      default:
        throw new Error("Unsupported product type.");
    }
  }
}

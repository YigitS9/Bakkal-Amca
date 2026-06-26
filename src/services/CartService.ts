import { ProductFactory } from "@/domain/factories/ProductFactory";
import { InsufficientStockError } from "@/exceptions/InsufficientStockError";
import { ForbiddenError } from "@/exceptions/ForbiddenError";
import { NotFoundError } from "@/exceptions/NotFoundError";
import { CartRepository } from "@/repositories/CartRepository";
import { ProductRepository } from "@/repositories/ProductRepository";

export class CartService {
  private readonly carts = new CartRepository();
  private readonly products = new ProductRepository();

  public async getCart(userId: string) {
    return this.withTotal(await this.carts.getOrCreateByUserId(userId));
  }

  public async addItem(userId: string, productId: string, quantity: number) {
    const cart = await this.carts.getOrCreateByUserId(userId);
    const product = await this.products.findById(productId);

    if (!product || !product.isAvailable) {
      throw new NotFoundError("Product not found.");
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    const requestedQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (requestedQuantity > product.stockQuantity) {
      throw new InsufficientStockError();
    }

    await this.carts.upsertItem(cart.id, productId, quantity);
    return this.getCart(userId);
  }

  public async updateItem(userId: string, itemId: string, quantity: number) {
    const item = await this.carts.findItem(itemId);

    if (!item) {
      throw new NotFoundError("Cart item not found.");
    }

    if (item.cart.userId !== userId) {
      throw new ForbiddenError();
    }

    if (quantity > item.product.stockQuantity) {
      throw new InsufficientStockError();
    }

    await this.carts.updateItem(itemId, quantity);
    return this.getCart(userId);
  }

  public async removeItem(userId: string, itemId: string) {
    const item = await this.carts.findItem(itemId);

    if (!item) {
      throw new NotFoundError("Cart item not found.");
    }

    if (item.cart.userId !== userId) {
      throw new ForbiddenError();
    }

    await this.carts.deleteItem(itemId);
    return this.getCart(userId);
  }

  public async clearCart(userId: string) {
    const cart = await this.carts.getOrCreateByUserId(userId);
    await this.carts.clear(cart.id);
    return this.getCart(userId);
  }

  private withTotal<T extends { items: Array<{ quantity: number; product: { price: number } }> }>(
    cart: T
  ) {
    const items = cart.items.map((item) => {
      const product = ProductFactory.create(item.product as never);
      const unitPrice = product.getFinalPrice();

      return {
        ...item,
        unitPrice,
        lineTotal: Number((unitPrice * item.quantity).toFixed(2)),
        product: {
          ...item.product,
          finalPrice: unitPrice,
          storageInstructions: product.getStorageInstructions()
        }
      };
    });

    return {
      ...cart,
      items,
      total: Number(items.reduce((total, item) => total + item.lineTotal, 0).toFixed(2))
    };
  }
}

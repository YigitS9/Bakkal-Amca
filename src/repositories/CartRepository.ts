import { prisma } from "@/lib/prisma";

export class CartRepository {
  public getOrCreateByUserId(userId: string) {
    return prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        items: {
          include: { product: { include: { category: true } } },
          orderBy: { createdAt: "asc" }
        }
      }
    });
  }

  public findItem(id: string) {
    return prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true, product: true }
    });
  }

  public upsertItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId, productId, quantity }
    });
  }

  public updateItem(id: string, quantity: number) {
    return prisma.cartItem.update({ where: { id }, data: { quantity } });
  }

  public deleteItem(id: string) {
    return prisma.cartItem.delete({ where: { id } });
  }

  public clear(cartId: string) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }
}

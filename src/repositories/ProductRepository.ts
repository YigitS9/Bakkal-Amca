import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class ProductRepository {
  public findMany(params: { search?: string | null; categoryId?: string | null } = {}) {
    return prisma.product.findMany({
      where: {
        isAvailable: true,
        name: params.search ? { contains: params.search } : undefined,
        categoryId: params.categoryId || undefined
      },
      include: { category: true },
      orderBy: { name: "asc" }
    });
  }

  public findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  public create(data: Prisma.ProductUncheckedCreateInput) {
    return prisma.product.create({ data, include: { category: true } });
  }

  public update(id: string, data: Prisma.ProductUncheckedUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true }
    });
  }

  public delete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isAvailable: false },
      include: { category: true }
    });
  }

  public count() {
    return prisma.product.count({ where: { isAvailable: true } });
  }

  public lowStock(threshold = 10) {
    return prisma.product.findMany({
      where: { isAvailable: true, stockQuantity: { lte: threshold } },
      include: { category: true },
      orderBy: { stockQuantity: "asc" }
    });
  }
}

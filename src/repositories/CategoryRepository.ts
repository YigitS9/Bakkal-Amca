import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class CategoryRepository {
  public findMany() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } }
    });
  }

  public findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  }

  public create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  }

  public update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  }

  public delete(id: string) {
    return prisma.category.delete({ where: { id } });
  }

  public count() {
    return prisma.category.count();
  }
}

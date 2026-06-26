import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class OrderRepository {
  public findManyByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
  }

  public findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true, user: { select: { id: true, fullName: true, email: true } } }
    });
  }

  public findAll() {
    return prisma.order.findMany({
      include: { items: true, user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });
  }

  public updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true, user: { select: { id: true, fullName: true, email: true } } }
    });
  }

  public count() {
    return prisma.order.count();
  }

  public recent(limit = 5) {
    return prisma.order.findMany({
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: limit
    });
  }
}

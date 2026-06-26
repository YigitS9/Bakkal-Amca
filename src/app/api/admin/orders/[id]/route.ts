import { UserRole } from "@prisma/client";
import { handleApiError } from "@/exceptions/handleApiError";
import { requireAdmin } from "@/lib/auth";
import { orderStatusSchema } from "@/lib/validators";
import { OrderService } from "@/services/OrderService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const order = await new OrderService().getOrderById(id, {
      id: "admin",
      role: UserRole.ADMIN
    });

    return Response.json(order);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const input = orderStatusSchema.parse(await request.json());
    const order = await new OrderService().updateStatus(id, input.status);

    return Response.json(order);
  } catch (error) {
    return handleApiError(error);
  }
}

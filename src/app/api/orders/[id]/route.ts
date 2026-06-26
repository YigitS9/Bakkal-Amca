import { handleApiError } from "@/exceptions/handleApiError";
import { getCurrentUser } from "@/lib/auth";
import { OrderService } from "@/services/OrderService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    const { id } = await context.params;
    const order = await new OrderService().getOrderById(id, { id: user.id, role: user.role });

    return Response.json(order);
  } catch (error) {
    return handleApiError(error);
  }
}

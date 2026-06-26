import { handleApiError } from "@/exceptions/handleApiError";
import { requireAdmin } from "@/lib/auth";
import { OrderService } from "@/services/OrderService";

export async function GET() {
  try {
    await requireAdmin();
    const orders = await new OrderService().getAllOrders();
    return Response.json(orders);
  } catch (error) {
    return handleApiError(error);
  }
}

import { handleApiError } from "@/exceptions/handleApiError";
import { requireCustomer } from "@/lib/auth";
import { OrderService } from "@/services/OrderService";

export async function GET() {
  try {
    const user = await requireCustomer();
    const orders = await new OrderService().getMyOrders(user.id);
    return Response.json(orders);
  } catch (error) {
    return handleApiError(error);
  }
}

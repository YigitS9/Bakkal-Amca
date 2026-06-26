import { handleApiError } from "@/exceptions/handleApiError";
import { requireCustomer } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validators";
import { OrderService } from "@/services/OrderService";

export async function POST(request: Request) {
  try {
    const user = await requireCustomer();
    const input = checkoutSchema.parse(await request.json());
    const order = await new OrderService().checkout(user.id, input.paymentMethod);

    return Response.json(order, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

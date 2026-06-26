import { handleApiError } from "@/exceptions/handleApiError";
import { requireCustomer } from "@/lib/auth";
import { cartItemSchema } from "@/lib/validators";
import { CartService } from "@/services/CartService";

export async function POST(request: Request) {
  try {
    const user = await requireCustomer();
    const input = cartItemSchema.parse(await request.json());
    const cart = await new CartService().addItem(user.id, input.productId, input.quantity);

    return Response.json(cart, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

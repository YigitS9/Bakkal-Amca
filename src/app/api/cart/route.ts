import { handleApiError } from "@/exceptions/handleApiError";
import { requireCustomer } from "@/lib/auth";
import { CartService } from "@/services/CartService";

export async function GET() {
  try {
    const user = await requireCustomer();
    const cart = await new CartService().getCart(user.id);
    return Response.json(cart);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    const user = await requireCustomer();
    const cart = await new CartService().clearCart(user.id);
    return Response.json(cart);
  } catch (error) {
    return handleApiError(error);
  }
}

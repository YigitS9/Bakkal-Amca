import { handleApiError } from "@/exceptions/handleApiError";
import { requireCustomer } from "@/lib/auth";
import { cartItemUpdateSchema } from "@/lib/validators";
import { CartService } from "@/services/CartService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await requireCustomer();
    const { id } = await context.params;
    const input = cartItemUpdateSchema.parse(await request.json());
    const cart = await new CartService().updateItem(user.id, id, input.quantity);

    return Response.json(cart);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireCustomer();
    const { id } = await context.params;
    const cart = await new CartService().removeItem(user.id, id);

    return Response.json(cart);
  } catch (error) {
    return handleApiError(error);
  }
}

import { handleApiError } from "@/exceptions/handleApiError";
import { ProductService } from "@/services/ProductService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const product = await new ProductService().getProductById(id);
    return Response.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

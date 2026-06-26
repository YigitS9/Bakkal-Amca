import { handleApiError } from "@/exceptions/handleApiError";
import { requireAdmin } from "@/lib/auth";
import { productUpdateSchema, stockUpdateSchema } from "@/lib/validators";
import { ProductService } from "@/services/ProductService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const input = productUpdateSchema.parse(await request.json());
    const product = await new ProductService().updateProduct(id, input);

    return Response.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const input = stockUpdateSchema.parse(await request.json());
    const product = await new ProductService().updateStock(id, input.stockQuantity);

    return Response.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const product = await new ProductService().deleteProduct(id);

    return Response.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

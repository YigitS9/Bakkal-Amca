import { handleApiError } from "@/exceptions/handleApiError";
import { requireAdmin } from "@/lib/auth";
import { categoryUpdateSchema } from "@/lib/validators";
import { CategoryService } from "@/services/CategoryService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const input = categoryUpdateSchema.parse(await request.json());
    const category = await new CategoryService().updateCategory(id, input);

    return Response.json(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const category = await new CategoryService().deleteCategory(id);

    return Response.json(category);
  } catch (error) {
    return handleApiError(error);
  }
}

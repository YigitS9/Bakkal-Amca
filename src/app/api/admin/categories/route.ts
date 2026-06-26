import { handleApiError } from "@/exceptions/handleApiError";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validators";
import { CategoryService } from "@/services/CategoryService";

export async function GET() {
  try {
    await requireAdmin();
    const categories = await new CategoryService().getAllCategories();
    return Response.json(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const input = categorySchema.parse(await request.json());
    const category = await new CategoryService().createCategory(input);

    return Response.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

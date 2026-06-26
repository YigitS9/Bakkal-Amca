import { handleApiError } from "@/exceptions/handleApiError";
import { CategoryService } from "@/services/CategoryService";

export async function GET() {
  try {
    const categories = await new CategoryService().getAllCategories();
    return Response.json(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

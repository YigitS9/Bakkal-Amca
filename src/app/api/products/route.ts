import { handleApiError } from "@/exceptions/handleApiError";
import { ProductService } from "@/services/ProductService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const products = await new ProductService().getAllProducts({
      search: searchParams.get("search"),
      categoryId: searchParams.get("categoryId")
    });

    return Response.json(products);
  } catch (error) {
    return handleApiError(error);
  }
}

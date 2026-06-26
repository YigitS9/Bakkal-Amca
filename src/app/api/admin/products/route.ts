import { handleApiError } from "@/exceptions/handleApiError";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { ProductService } from "@/services/ProductService";

export async function GET(request: Request) {
  try {
    await requireAdmin();
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

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const input = productSchema.parse(await request.json());
    const product = await new ProductService().createProduct(input);

    return Response.json(product, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

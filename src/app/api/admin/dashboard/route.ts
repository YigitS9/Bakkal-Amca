import { handleApiError } from "@/exceptions/handleApiError";
import { requireAdmin } from "@/lib/auth";
import { AdminService } from "@/services/AdminService";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await new AdminService().getDashboardStats();
    return Response.json(stats);
  } catch (error) {
    return handleApiError(error);
  }
}

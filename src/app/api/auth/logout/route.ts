import { handleApiError } from "@/exceptions/handleApiError";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookie();
    return Response.json({ message: "Logged out." });
  } catch (error) {
    return handleApiError(error);
  }
}

import { handleApiError } from "@/exceptions/handleApiError";
import { getCurrentUser, toSafeUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return Response.json({ user: toSafeUser(user) });
  } catch (error) {
    return handleApiError(error);
  }
}

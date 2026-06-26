import { handleApiError } from "@/exceptions/handleApiError";
import { setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { AuthService } from "@/services/AuthService";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const result = await new AuthService().register(input);
    await setAuthCookie(result.token);

    return Response.json({ user: result.user }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

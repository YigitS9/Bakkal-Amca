import { handleApiError } from "@/exceptions/handleApiError";
import { setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { AuthService } from "@/services/AuthService";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const result = await new AuthService().login(input);
    await setAuthCookie(result.token);

    return Response.json({ user: result.user });
  } catch (error) {
    return handleApiError(error);
  }
}

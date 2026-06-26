import { ZodError } from "zod";
import { AppError } from "./AppError";

export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    return Response.json({ error: error.message }, { status: error.statusCode });
  }

  if (error instanceof ZodError) {
    return Response.json(
      { error: "Validation failed.", details: error.flatten() },
      { status: 400 }
    );
  }

  console.error(error);

  return Response.json({ error: "An unexpected error occurred." }, { status: 500 });
}

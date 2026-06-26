import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  public constructor(message = "Resource not found.") {
    super(message, 404);
  }
}

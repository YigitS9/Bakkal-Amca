import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  public constructor(message = "You do not have permission to access this resource.") {
    super(message, 403);
  }
}

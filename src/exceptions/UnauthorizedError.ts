import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  public constructor(message = "Authentication required.") {
    super(message, 401);
  }
}

import { AppError } from "./AppError";

export class ValidationError extends AppError {
  public constructor(message = "Validation failed.") {
    super(message, 400);
  }
}

import { AppError } from "./AppError";

export class InsufficientStockError extends AppError {
  public constructor(message = "Not enough stock available.") {
    super(message, 409);
  }
}

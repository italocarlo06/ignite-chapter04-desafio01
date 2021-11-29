import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferStatementError {
  export class UserNotFound extends AppError {
    constructor(message?: string) {
      super(message? message: 'User not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }
}

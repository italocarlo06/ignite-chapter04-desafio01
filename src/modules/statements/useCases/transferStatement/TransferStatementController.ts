import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { TransferStatementUseCase } from './TransferStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class TranferStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;    
        
    const { destination_user } = request.params;        

    const transferStatement = container.resolve(TransferStatementUseCase);

    const statement = await transferStatement.execute({
      user_id:destination_user,
      type: OperationType.TRANSFER,
      amount,
      description,
      sender_id: user_id      
    });

    return response.status(201).json(statement);
  }
}

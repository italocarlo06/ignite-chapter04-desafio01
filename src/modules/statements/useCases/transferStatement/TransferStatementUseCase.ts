import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferStatementError } from "./TransferStatementError";
import { ITransferStatementDTO } from "./ITransferStatementDTO";

@injectable()
export class TransferStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, type, amount, description, sender_id }: ITransferStatementDTO) {    
    const user = await this.usersRepository.findById(user_id);

    console.log("oi")
    console.log(user_id);
    console.log(sender_id);

    if(!user) {      
      throw new TransferStatementError.UserNotFound("Receive User is not found!");
    }
    
    if (sender_id){
      console.log(sender_id);
      const sender_user = await this.usersRepository.findById(sender_id);
      if(!sender_user) {
        throw new TransferStatementError.UserNotFound("Sender user is not found!");
      }

      const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

      if (balance < amount) {
        throw new TransferStatementError.InsufficientFunds();
      }  
    }
    


    

    const statementOperationOrigin = await this.statementsRepository.create({
      user_id: sender_id ? sender_id : "",
      type,
      amount,
      description: `Transfer to ${user_id}`,      
      receiver_id: user_id
    });


    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      sender_id
    });

    return statementOperation;
  }
}

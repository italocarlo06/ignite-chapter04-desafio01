import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

  beforeEach( () => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();

    createUserUseCase= new CreateUserUseCase(usersRepository);

    createStatementUseCase= new CreateStatementUseCase(
      usersRepository, 
      statementsRepository
    );
  });

  it("should be able to create a deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password:"123456"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id ? user.id : "",
      amount: 10,
      description: "deposit",
      type: OperationType.DEPOSIT,
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a deposit with a not existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "123465",
        amount: 10,
        description: "deposit",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);    
  });


  it("should be able to create a withdraw in a user balance with sufficiente funds", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password:"123456"
    });

    await createStatementUseCase.execute({
      user_id: user.id ? user.id : "",
      amount: 100,
      description: "deposit",
      type: OperationType.DEPOSIT,
    });

    const withdrawStatement = await createStatementUseCase.execute({
      user_id: user.id ? user.id : "",
      amount: 50,
      description: "withdraw",
      type: OperationType.WITHDRAW,
    });

    expect(withdrawStatement).toHaveProperty("id");
  });


  it("should not be able to create a withdraw in a user balance with insufficiente funds", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password:"123456"
    });

    await createStatementUseCase.execute({
      user_id: user.id ? user.id : "",
      amount: 100,
      description: "deposit",
      type: OperationType.DEPOSIT,
    });

    
    expect( async () => {  
      await createStatementUseCase.execute({
        user_id: user.id ? user.id : "",
        amount: 500,
        description: "withdraw",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
        
  });
});
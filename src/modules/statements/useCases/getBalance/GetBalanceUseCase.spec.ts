import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

import { GetBalanceError } from "./GetBalanceError";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance ", () => {

  beforeEach( () => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();

    createUserUseCase= new CreateUserUseCase(usersRepository);

    createStatementUseCase= new CreateStatementUseCase(
      usersRepository, 
      statementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );      
  });

  it("should be able to get balance of a user", async () => {
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

    await createStatementUseCase.execute({
      user_id: user.id ? user.id : "",
      amount: 10,
      description: "withdraw",
      type: OperationType.WITHDRAW,
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id || ""
    })

    expect(response.balance).toEqual(90);
  });


  it("should not be able get balance from a non existent user", async () => {
    expect( async () => {
      await getBalanceUseCase.execute({
        user_id: "132456"
      })  
    }).rejects.toBeInstanceOf(GetBalanceError)
  });  
});
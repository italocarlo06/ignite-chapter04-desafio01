import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

import { GetStatementOperationError } from "./GetStatementOperationError";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {

  beforeEach( () => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();

    createUserUseCase= new CreateUserUseCase(usersRepository);

    createStatementUseCase= new CreateStatementUseCase(
      usersRepository, 
      statementsRepository
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should not be able get a statement from not registered user", async () => {
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


    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: statement.id || "",
        user_id: "1234"
      });      
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);    
  });

  it("should not be able get a statement not registered", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password:"123456"
    });
    const user_id  =  user.id ? user.id : "";
    
    expect(async () => {    
      await getStatementOperationUseCase.execute({
        statement_id: "132465",
        user_id
      });            
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);    
  });



});
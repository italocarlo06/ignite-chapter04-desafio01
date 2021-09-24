import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let usersRepository:InMemoryUsersRepository;
let createUserUseCase:CreateUserUseCase;

describe("Create User", () => {
  
  beforeEach( () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });
  it("should be able to create a New User ", async () => {
     const user = await createUserUseCase.execute({
       name: "User Test",
       email: "user@test.com",
       password:"123456"
     });

     expect(user).toHaveProperty("id");     
  });

  it("should not be able to create a new User with same email ", async () => {
    await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password:"123456"
    });
    
    expect( async () => {        
      await createUserUseCase.execute({
        name: "User Test 2",
        email: "user@test.com",
        password:"123456"
      });    
    }).rejects.toBeInstanceOf(CreateUserError);
    
 });
});
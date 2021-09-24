import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository:InMemoryUsersRepository;
let authenticateUserUseCase:AuthenticateUserUseCase;
let createUserUseCase:CreateUserUseCase;

describe("Authenticate User", () => {
  
  beforeEach( () => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);    
    createUserUseCase= new CreateUserUseCase(usersRepository);
  });

  it("should be able to authenticate with a existent User ", async () => {
     const user = await createUserUseCase.execute({
       name: "User Test",
       email: "user@test.com",
       password:"123456"
     });

     const response = await authenticateUserUseCase.execute({
       email: user.email,
       password: "123456"       
     });
     
     expect(response).toHaveProperty("token");
  });


  it("should not be able to authenticate with a wrong email ", async () => {
    await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password:"123456"
    });
    
    expect( async  () => {  
      await authenticateUserUseCase.execute({
        email: "user2@test.com",
        password: "123456"       
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
 });

 it("should not be able to authenticate with a wrong password ", async () => {
  expect( async  () => {
    await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password:"123456"
    });

    await authenticateUserUseCase.execute({
      email: "user@test.com",
      password: "123457"       
    });
  }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
});

});
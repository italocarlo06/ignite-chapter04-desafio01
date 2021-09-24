import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let usersRepository:InMemoryUsersRepository;
let createUserUseCase:CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  
  beforeEach( () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase= new ShowUserProfileUseCase(usersRepository);
  });
  it("should show a profile of a existing User ", async () => {
     const user = await createUserUseCase.execute({
       name: "User Test",
       email: "user@test.com",
       password:"123456"
     });
     const id = user.id ? user.id : "";
     const userProfile = await showUserProfileUseCase.execute(id);
     
     expect(userProfile.id).toEqual(id);
     expect(userProfile.email).toEqual(user.email);
     expect(userProfile.name).toEqual(user.name);
     
  });

  it("should not be able to create a new User with same email ", async () => {
    expect( async () => {
      await showUserProfileUseCase.execute("132456");    
   
    }).rejects.toBeInstanceOf(ShowUserProfileError);
    
 });
});
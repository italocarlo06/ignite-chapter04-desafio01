import { Connection } from "typeorm";
import request from "supertest";

import { app } from "../../../../app";
import createConnection from "../../../../database";
import { CreateUserError } from "../../../users/useCases/createUser/CreateUserError";

let connection: Connection;
let token: string;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement Controller" , () => {

  async function createUser(){
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password:"123456"
    });
  }

  async function deleteUser(){
    await connection.query(` DELETE FROM USERS `);
  }

  async function login(){
    const responseToken = await request(app).post("/api/v1/sessions").send({     
      email: "user@test.com",
      password:"123456"
    });

    token = responseToken.body.token;
  }

  beforeAll( async () => {
    connection= await createConnection();
    await connection.runMigrations();
    await createUser();
    await login();    
  });


  afterAll( async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("should be able to get user's balance", async () => {
    
    await request(app).post("/api/v1/statements/deposit").send({      
      amount: 100,
      description: "deposit",    
    }).set({
      Authorization: `Bearer ${token}`
    });

    await request(app).post("/api/v1/statements/deposit").send({      
      amount: 100,
      description: "deposit",    
    }).set({
      Authorization: `Bearer ${token}`
    });

    await request(app).post("/api/v1/statements/withdraw").send({      
      amount: 10,
      description: "withdraw",    
    }).set({
      Authorization: `Bearer ${token}`
    });

    const responseBalance = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer ${token}`
    });
    
    expect(responseBalance.body).toHaveProperty("balance");    
    expect(responseBalance.body.balance).toEqual(190);
    expect(responseBalance.body.statement.length).toEqual(3);

  });


});


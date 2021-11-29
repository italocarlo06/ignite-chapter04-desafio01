import { Connection } from "typeorm";
import request from "supertest";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
let token: string;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
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
  it("should be able to create a new deposit", async () => {
    
    const responseStatement = await request(app).post("/api/v1/statements/deposit").send({      
      amount: 100,
      description: "deposit",    
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(responseStatement.status).toBe(201);
    expect(responseStatement.body).toHaveProperty("id");    

  });


  it("should not be able to create a new deposit without inform a user token", async () => {
    
    const responseStatement = await request(app).post("/api/v1/statements/deposit").send({      
      amount: 100,
      description: "deposit",    
    }).set({
      Authorization: `Bearer ${token}1`
    });

    expect(responseStatement.status).toBe(401);  

  });

  
  it("should not be able to create a new deposit without inform a user token", async () => {
    
    const responseStatement = await request(app).post("/api/v1/statements/deposit").send({      
      amount: 100,
      description: "deposit",    
    });

    expect(responseStatement.status).toBe(401);    

  });


  it("should be able to create a new withdraw", async () => {
    
    const responseStatement = await request(app).post("/api/v1/statements/withdraw").send({      
      amount: 10,
      description: "withdraw",    
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(responseStatement.status).toBe(201);
    expect(responseStatement.body).toHaveProperty("id");    

  });

  it("should not be able to create a new withdraw with insufficient funds", async () => {
       
    const responseStatement = await request(app).post("/api/v1/statements/withdraw").send({      
      amount: 120,
      description: "withdraw",    
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(responseStatement.status).toBe(400);    

  });

  it("should not be able to create a new deposit without a user registered", async () => {
    
    await deleteUser();
    const responseStatement = await request(app).post("/api/v1/statements/deposit").send({      
      amount: 100,
      description: "deposit",    
    }).set({
      Authorization: `Bearer ${token}`
    });    

    expect(responseStatement.status).toBe(404);  

  });


  it("should not be able to create a new withdraw without a user registered", async () => {
        
    const responseStatement = await request(app).post("/api/v1/statements/withdraw").send({      
      amount: 10,
      description: "withdraw",    
    }).set({
      Authorization: `Bearer ${token}`
    });    

    expect(responseStatement.status).toBe(404);  

  });
});


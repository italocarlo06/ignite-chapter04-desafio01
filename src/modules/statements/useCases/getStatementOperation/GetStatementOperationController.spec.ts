import { Connection } from "typeorm";
import request from "supertest";

import { app } from "../../../../app";
import createConnection from "../../../../database";
import { v4 as uuidv4 } from "uuid"

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
  it("should be able to retrieve a statement", async () => {
    
    const response = await request(app).post("/api/v1/statements/deposit").send({      
      amount: 100,
      description: "deposit",    
    }).set({
      Authorization: `Bearer ${token}`
    });

    const { id } = response.body.id;

    const responseStatement = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    });

    expect(responseStatement.body.id).toEqual(id);
  });

  it("should not be able to retrieve a statement not registered", async () => {
            
    const responseStatement = await request(app).get(`/api/v1/statements/${uuidv4()}`).set({
      Authorization: `Bearer ${token}`
    });
    
    expect(responseStatement.status).toEqual(404);
  });


  it("should not be able to retrieve a statement with wrong uuid", async () => {
            
    const responseStatement = await request(app).get(`/api/v1/statements/123456`).set({
      Authorization: `Bearer ${token}`
    });
    
    expect(responseStatement.status).toEqual(500);
  });


  it("should not be able to retrieve a statement with a not existent user", async () => {
    
    await deleteUser();

    const responseStatement = await request(app).get(`/api/v1/statements/123456`).set({
      Authorization: `Bearer ${token}`
    });
    
    expect(responseStatement.status).toEqual(404);
  });

});


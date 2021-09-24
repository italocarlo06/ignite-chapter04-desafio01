import { Connection } from "typeorm";
import request from "supertest";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Show User Profile Controller", () => {

  beforeAll( async () => {
    connection = await createConnection();
    await connection.runMigrations();
    
  });

  afterAll( async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  async function deleteUser(){
    await connection.query(` DELETE FROM USERS `);
  }

  it("should be able to retrieve user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password:"123456"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({     
      email: "user@test.com",
      password:"123456"
    });

    const token = responseToken.body.token;

    const responseProfile = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`
    });    

    expect(responseProfile.body).toHaveProperty("id");


  });


  it("should not be able to retrieve user profile", async () => {    

    const responseToken = await request(app).post("/api/v1/sessions").send({     
      email: "user@test.com",
      password:"123456"
    });

    const token = responseToken.body.token;

    await deleteUser();

    const responseProfile = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`
    });    

    expect(responseProfile.status).toEqual(404);


  });

});
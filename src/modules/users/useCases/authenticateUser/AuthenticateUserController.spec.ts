import { Connection } from "typeorm";
import request from "supertest";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate User Controller", () => {

  beforeAll( async () => {
    connection = await createConnection();
    await connection.runMigrations();
    
  });

  afterAll( async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("should be able to authenticate using a registered user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password:"123456"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({     
      email: "user@test.com",
      password:"123456"
    });

    expect(responseToken.body).toHaveProperty("token");


  });

  it("should not be able to authenticate with wrong email", async () => {
    
    const responseToken = await request(app).post("/api/v1/sessions").send({     
      email: "user2@test.com",
      password:"123456"
    });

    expect(responseToken.status).toEqual(401);
  });


  it("should not be able to authenticate with wrong password", async () => {
    
    const responseToken = await request(app).post("/api/v1/sessions").send({     
      email: "user@test.com",
      password:"12345"
    });

    expect(responseToken.status).toEqual(401);
  });

});
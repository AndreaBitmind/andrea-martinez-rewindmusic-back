import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();

  await connectDB(mongoURL);
});

afterAll(async () => {
  mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given the endpoint POST /users/register", () => {
  describe("When it receives a request with username 'andrea' and password '123456'", () => {
    test("Then it should response with status 201 and the message 'User created'", async () => {
      const message = "User created";
      const { body } = await request(app)
        .post("/users/register")
        .send({ userName: "andrea", password: "123456" })
        .expect(201);

      expect(body).toHaveProperty("message", message);
    });
  });

  describe("When it receives a request without password", () => {
    test("Then it should response with status 400 and a message 'Wrong data'", async () => {
      const message = "Wrong data";
      const { body } = await request(app)
        .post("/users/register")
        .send({
          userName: "pepita",
        })
        .expect(400);

      expect(body).toHaveProperty("error", message);
    });
  });
});

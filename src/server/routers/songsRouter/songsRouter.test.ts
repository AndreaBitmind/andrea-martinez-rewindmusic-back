import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database";
import Song from "../../../database/models/Song";
/* import Song from "../../../database/models/Song"; */

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();

  await connectDB(mongoURL);
});

afterEach(async () => {
  await Song.deleteMany({});
});

afterAll(async () => {
  mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a GET endpoint", () => {
  describe("When it receive a request with method get", () => {
    test("Then it should response with status 200", async () => {
      const expectedStatus = 200;

      await Song.create({
        songName: "We are your friends",
        album: "We are your friends",
        year: "2001",
        band: "Justice, Simian",
        instrument: ["guitar"],
        image: "http://picture.com",
        embeded: "prueba2",
        id: "135165",
      });

      await request(app).get("/songs").expect(expectedStatus);
    });
  });

  describe("When it receives a request with method get but there isn't any object on the database", () => {
    test("Then it should throw a 404 NOT FOUND error", async () => {
      const expectedStatus = 404;

      await request(app).get("/songs").expect(expectedStatus);
    });
  });
});

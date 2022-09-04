import { NextFunction, Request, Response } from "express";
import Song from "../../database/models/Song";
import { Isong } from "../../interfaces/songInterface";
import CustomError from "../../utils/CustomError";
import getAllSongs from "./songsController";

describe("Given a getAllSongs function", () => {
  const mockSong: Isong = {
    songName: "Barbie girl",
    album: "vicios y virtudes",
    year: "2001",
    band: "SFDK",
    instrument: ["piano"],
    image: "http://picture.com",
    embeded: "prueba1",
  };

  const req = {} as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const next = jest.fn() as NextFunction;

  describe("When it's called with a request, response and a next function", () => {
    test("Then it should response with a status 200", async () => {
      Song.find = jest.fn().mockReturnValue([mockSong]);

      const expectedStatus = 200;

      await getAllSongs(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should respond with all the songs found", async () => {
      const expectedResponse = {
        songs: [mockSong],
      };

      await getAllSongs(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When called but doesn't return any valid data", () => {
    test("Then it should call next function with an error", async () => {
      Song.find = jest.fn().mockRejectedValue(new Error());

      const expectedError = new CustomError(
        404,
        "Error while getting songs",
        "No songs found"
      );

      await getAllSongs(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When called but there are no songs avaliables", () => {
    test("Then it should respond with 'Error while getting songs' message", async () => {
      Song.find = jest.fn().mockReturnValue([]);

      const expectedError = { songs: "No songs found" };
      const status = 404;

      await getAllSongs(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});

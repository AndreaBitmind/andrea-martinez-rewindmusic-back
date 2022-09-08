import { NextFunction, Request, Response } from "express";
import Song from "../../database/models/Song";
import { Isong } from "../../interfaces/SongsInterface";
import CustomError from "../../utils/CustomError";
import { deleteSong, getAllSongs, getById } from "./songsController";

const mockSong: Isong = {
  songName: "Barbie girl",
  album: "vicios y virtudes",
  year: "2001",
  band: "SFDK",
  instrument: ["piano"],
  image: "http://picture.com",
  embeded: "prueba1",
};
describe("Given a getAllSongs function", () => {
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

describe("Given a deleteSong controller", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a method status and a confirmation of deletion", async () => {
      const expectedJsonMessage = {
        message: "Song deleted correctly",
      };
      const next = jest.fn() as NextFunction;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response>;
      const req = {
        params: { id: "629a0d040a3e1e0a9b455361" },
      } as Partial<Request>;

      Song.findByIdAndDelete = jest.fn().mockResolvedValue(expectedJsonMessage);
      await deleteSong(req as Request, res as Response, next as NextFunction);

      const expectedStatus = 200;

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJsonMessage);
    });
  });

  describe("When it receives a request to delete an item but can't find it", () => {
    test("Then it should throw a CustomError with 404 as code", async () => {
      const requestTest = {
        params: { id: "" },
      } as Partial<Request>;

      const expectedError = new CustomError(
        404,
        "Error while deleting song",
        "Error while deleting song"
      );

      Song.findByIdAndDelete = jest.fn().mockRejectedValue(expectedError);

      const next = jest.fn() as NextFunction;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await deleteSong(requestTest as Request, responseTest as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getById function", () => {
  describe("When it's called with a request, response and next function", () => {
    test("Then it show response with a status 200 and the song found", async () => {
      const requestTest = {
        params: { id: "62e0ajh9b455361" },
      } as Partial<Request>;

      const expectedStatus = 200;
      const expectedResult = { song: mockSong };
      const next = jest.fn() as NextFunction;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response>;

      Song.findById = jest.fn().mockResolvedValue(expectedResult);

      await getById(requestTest as Request, responseTest as Response, next);
      expect(responseTest.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request to find a song, but can't find it", () => {
    test("Then it should response with 404 as code", async () => {
      const requestTest = {
        params: { id: "" },
      } as Partial<Request>;

      const expectedStatus = 200;

      Song.findById = jest.fn().mockReturnValue("");

      const next = jest.fn() as NextFunction;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await getById(requestTest as Request, responseTest as Response, next);

      expect(responseTest.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request to find a song, but has error while finding the song requested", () => {
    test("Then it should call next function with an error", async () => {
      Song.findById = jest.fn().mockRejectedValue(new Error());

      const requestTest = {
        params: { id: "" },
      } as Partial<Request>;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const expectedError = new CustomError(
        404,
        "Element not found",
        "Error while finding the song requested"
      );

      const next = jest.fn() as NextFunction;

      await getById(requestTest as Request, responseTest as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

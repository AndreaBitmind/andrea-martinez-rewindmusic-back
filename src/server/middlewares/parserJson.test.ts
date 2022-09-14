import path from "path";
import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import CustomError from "../../utils/CustomError";
import parserJson from "./parserJson";

jest.useFakeTimers();

describe("Given a parserJson middleware", () => {
  describe("When called with a request, a response and a next function as arguments", () => {
    const mockedReqBody = {
      image: "",
    };

    const songJson = JSON.stringify(mockedReqBody);

    jest
      .spyOn(path, "join")
      .mockReturnValue(`${path.join("uploads", "images")}`);

    jest.spyOn(fs, "rename").mockResolvedValue();

    const req = {
      body: { song: songJson },
      file: { filename: "", originalname: "" },
    } as Partial<Request>;

    const res = {} as Partial<Response>;

    const next = jest.fn() as NextFunction;

    test("Then it should asign the data as req body", async () => {
      await parserJson(req as Request, res as Response, next);

      expect(req.body).toEqual({
        ...mockedReqBody,
        image: `${Date.now()}${req.file.originalname}`,
      });

      expect(next).toHaveBeenCalled();
    });

    test("Then it should asign the data as req body", async () => {
      const reqWithoutImage = {
        body: { song: songJson },
      } as Partial<Request>;

      const customError = new CustomError(400, "Missing data", "Missing data");
      await parserJson(reqWithoutImage as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

import { Response, Request, NextFunction } from "express";
import { ICustomError } from "../../interfaces/ErrorsInterface";
import { notFoundError, generalError } from "./errors";

describe("Given a notFoundError middleware", () => {
  describe("When it receives a response object", () => {
    const responseTest = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const requestTest = {} as Partial<Request>;

    test("Then it should call the response method status with 404", () => {
      const status = 404;

      notFoundError(requestTest as Request, responseTest as Response);

      expect(responseTest.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call the response method with a json object with an error property", () => {
      const ErrorResponse = { error: "Endpoint not found" };

      notFoundError(requestTest as Request, responseTest as Response);

      expect(responseTest.json).toHaveBeenCalledWith(ErrorResponse);
    });
  });
});

describe("Given a generalError function", () => {
  describe("When its called", () => {
    test("Then it should respond with a status error code and a public message error", async () => {
      const error = {
        code: 580,
        publicMessage: "Everything has gone wrong",
      };
      const request = {};
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      };
      const next = jest.fn;
      const status = 580;
      const resolvedJson = { error: error.publicMessage };

      await generalError(
        error as ICustomError,
        request as unknown as Request,
        response as unknown as Response,
        next as NextFunction
      );

      expect(response.status).toBeCalledWith(status);
      expect(response.json).toBeCalledWith(resolvedJson);
    });
  });
});

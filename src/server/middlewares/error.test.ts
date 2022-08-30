import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/CustomError";
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
      const error: CustomError = {
        publicMessage: "Something is not going well",
        code: "",
        statusCode: 456,
        message: "",
        name: "",
      };

      const request = {};
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      };
      const next = jest.fn;
      const status = 456;
      const resolvedJson = { error: error.publicMessage };

      await generalError(
        error as CustomError,
        request as unknown as Request,
        response as unknown as Response,
        next as NextFunction
      );

      expect(response.status).toBeCalledWith(status);
      expect(response.json).toBeCalledWith(resolvedJson);
    });
  });

  describe("When its called without a code an without a public message", () => {
    test("Then it should return a response with 500 and a default message", async () => {
      const error: CustomError = {
        publicMessage: null,
        code: "",
        statusCode: null,
        message: "",
        name: "",
      };
      const request = {};
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      };
      const next = jest.fn;
      const status = 500;
      const resolvedJson = { error: "Everything has gone wrong" };

      await generalError(
        error as CustomError,
        request as unknown as Request,
        response as unknown as Response,
        next as NextFunction
      );

      expect(response.status).toBeCalledWith(status);
      expect(response.json).toBeCalledWith(resolvedJson);
    });
  });
});

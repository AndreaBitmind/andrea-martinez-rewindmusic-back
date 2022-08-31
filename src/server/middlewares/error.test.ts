import { Response, Request, NextFunction } from "express";
import { ValidationError } from "express-validation";
import CustomError from "../../utils/CustomError";
import { generalError, notFoundError } from "./errors";

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
  const request = {};
  const next = jest.fn;
  describe("When its called", () => {
    test("Then it should respond with a status error code and a public message error", async () => {
      const error = new CustomError(456, "", "Everything went wrong");

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      };
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

  describe("When its called with a null code and public message", () => {
    test("Then it should return a response with 500 and a default message", async () => {
      const error = new CustomError(null, "", "");

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      };

      const expectedStatus = 500;

      await generalError(
        error as CustomError,
        request as unknown as Request,
        response as unknown as Response,
        next as NextFunction
      );

      expect(response.status).toBeCalledWith(expectedStatus);
    });
  });

  describe("When it is instantiated with a publicMessage null", () => {
    test("Then it should give a response with the public message 'Everything went wrong'", async () => {
      const error = new CustomError(500, "", null);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      } as Partial<Response>;

      const expectedResponse = { error: "Everything went wrong" };

      await generalError(error, request as Request, response as Response, next);

      expect(response.json).toBeCalledWith(expectedResponse);
    });
  });

  describe("When it's called with a ValidationError", () => {
    test("Then it should send a 400 status and error message", async () => {
      const errorTest = new ValidationError(
        {
          body: [
            {
              message: "Error 1",
              isJoi: true,
              annotate: () => "",
              _original: "",
              name: "ValidationError",
              details: [],
            },
            {
              message: "Error 2",
              isJoi: true,
              annotate: () => "",
              _original: "",
              name: "ValidationError",
              details: [],
            },
          ],
        },
        { statusCode: 400 }
      );

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const expectedStatus = 400;

      await generalError(
        errorTest,
        request as Request,
        response as Response,
        next
      );

      expect(response.json).toBeCalledWith({ error: "Wrong data" });
      expect(response.status).toBeCalledWith(expectedStatus);
    });
  });
});

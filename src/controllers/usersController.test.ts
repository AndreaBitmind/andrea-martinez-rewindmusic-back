import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../database/models/User";
import CustomError from "../utils/CustomError";
import registerUser from "./usersController";

describe("Given a register user controller", () => {
  const mockBodyTest = {
    userName: "holi",
    password: "15165",
  };
  const reqTest = {
    body: {
      user: mockBodyTest,
    },
  } as Partial<Request>;
  const nextTest = jest.fn();
  const responseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const bcryptTest = jest.fn().mockResolvedValue("test");
  (bcrypt.hash as jest.Mock) = bcryptTest;

  describe("When it receives a response object", () => {
    test("Then it should call the response method status with 201", async () => {
      const status = 201;

      User.create = jest.fn();

      await registerUser(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );
      expect(responseTest.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call the response method json with a new user object", async () => {
      User.create = jest.fn().mockResolvedValue(mockBodyTest);

      await registerUser(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );
      expect(responseTest.json).toHaveBeenCalledWith({ user: mockBodyTest });
    });
  });

  describe("When it doesn't receive an user with the required properties", () => {
    test("Then it should throw an error", async () => {
      const customErrorTest = new CustomError(
        400,
        "pete general",
        "Error creating new user"
      );
      User.create = jest.fn().mockRejectedValue(customErrorTest);

      await registerUser(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );
      expect(nextTest).toHaveBeenCalledWith(customErrorTest);
    });
  });
});

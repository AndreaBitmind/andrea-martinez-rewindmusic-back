import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../database/models/User";
import CustomError from "../utils/CustomError";
import { loginUser, registerUser } from "./usersController";

const mockHashCreateValue: boolean | jest.Mock = true;

let mockHashCompareValue = true;

jest.mock("../utils/auth", () => ({
  ...jest.requireActual("../utils/auth"),
  createToken: () => jest.fn().mockReturnValue("#"),
  hashCreator: () => mockHashCreateValue,
  hashCompare: () => mockHashCompareValue,
}));

describe("Given a register user controller", () => {
  const bcryptTest = jest.fn().mockResolvedValue("test");
  (bcrypt.hash as jest.Mock) = bcryptTest;

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
      const expectedMessage = {
        message: "User created",
      };

      await registerUser(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );
      expect(responseTest.json).toHaveBeenCalledWith(expectedMessage);
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

describe("Given a loginUser function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fakeUser = {
    userName: "testLogin",
    password: "123456",
  };

  const fakeUserLogged = {
    _id: "12345",
    userName: "testLogin",
    password: "123456",
  };
  const requestLoginTest: Partial<Request> = { body: fakeUser };
  const responseLoginTest: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: Partial<NextFunction> = jest.fn();

  User.find = jest.fn().mockReturnValue([fakeUserLogged]);

  describe("When invoked with a request, response and next params", () => {
    test("Then it should call status function with code 200", async () => {
      mockHashCompareValue = true;
      await loginUser(
        requestLoginTest as Request,
        responseLoginTest as Response,
        next as NextFunction
      );
      const status = 200;

      expect(responseLoginTest.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call the json method of the response", async () => {
      await loginUser(
        requestLoginTest as Request,
        responseLoginTest as Response,
        next as NextFunction
      );

      expect(responseLoginTest.json).toHaveBeenCalled();
    });

    test("Then it should call the next function with the created error", async () => {
      User.find = jest.fn().mockReturnValue([]);
      const error = new CustomError(
        403,
        "User not found",
        "User or password not valid"
      );

      await loginUser(
        requestLoginTest as Request,
        responseLoginTest as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    test("It should call the next function if the user is found but the data doesn't match", async () => {
      const error = new CustomError(
        403,
        "User invalid",
        "User or password not valid"
      );
      User.find = jest.fn().mockRejectedValue(new Error());

      await loginUser(
        requestLoginTest as Request,
        responseLoginTest as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    test("Then it should call the next function with the created error if the password don't exist", async () => {
      User.find = jest.fn().mockReturnValue(false);
      mockHashCompareValue = false;

      const error = new CustomError(
        403,
        "Password not found",
        "User or password invalid "
      );

      await loginUser(
        requestLoginTest as Request,
        responseLoginTest as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    test("Then it should call the next function with the created error if the passwords don't match", async () => {
      const notValidPasswordTest = {
        userName: "testLogin",
        password: "498651",
      };

      User.find = jest.fn().mockReturnValue([notValidPasswordTest]);
      mockHashCompareValue = false;

      const userError = new CustomError(
        403,
        "Password invalid",
        "User or password not valid"
      );

      await loginUser(
        requestLoginTest as Request,
        responseLoginTest as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(userError);
    });
  });
});

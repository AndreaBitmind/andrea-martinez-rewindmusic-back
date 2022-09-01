import { NextFunction, Request, Response } from "express";
import User from "../database/models/User";
import { CustomJwtPayload } from "../interfaces/CustomJwtPayload";
import { UserData, UserRegister } from "../interfaces/UserInterfaces";
import { createToken, hashCompare, hashCreator } from "../utils/auth";
import CustomError from "../utils/CustomError";

export const registerUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const user: UserRegister = request.body;
  user.password = await hashCreator(user.password);

  try {
    await User.create(user);
    response.status(201).json({ message: "User created" });
  } catch (error) {
    const customError = new CustomError(
      409,
      error.message,
      "Error creating new user"
    );
    next(customError);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body as UserRegister;

  const userError = new CustomError(
    403,
    "User not found",
    "User or password not valid"
  );

  let findUsers: Array<UserData>;
  try {
    findUsers = await User.find({ userName: user.userName });
    if (findUsers.length === 0) {
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = new CustomError(
      403,
      `name: ${(error as Error).name}; message:  ${(error as Error).message}`,
      "User or password invalid "
    );
    next(finalError);
    return;
  }

  try {
    const isPasswordValid = await hashCompare(
      user.password,
      findUsers[0].password
    );
    if (!isPasswordValid) {
      userError.message = "Password invalid";
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = new CustomError(
      403,
      `name: ${(error as Error).name}; message:  ${(error as Error).message}`,
      "User or password invalid "
    );
    next(finalError);
    return;
  }

  const payLoad: CustomJwtPayload = {
    id: findUsers[0].id,
    userName: findUsers[0].userName,
  };

  const responseData = {
    user: {
      token: createToken(payLoad),
    },
  };

  res.status(200).json(responseData);
};

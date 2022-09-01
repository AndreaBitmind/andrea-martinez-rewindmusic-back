import { NextFunction, Request, Response } from "express";
import User from "../database/models/User";
import { UserRegister } from "../interfaces/UserInterfaces";
import hashCreator from "../utils/auth";
import CustomError from "../utils/CustomError";

const registerUser = async (
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

export default registerUser;

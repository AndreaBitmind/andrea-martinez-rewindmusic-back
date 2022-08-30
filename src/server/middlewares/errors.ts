import "../../loadEnvironment";
import { NextFunction, Request, Response } from "express";
import chalk from "chalk";
import Debug from "debug";
import { ValidationError } from "express-validation";
import CustomError from "../../utils/CustomError";

const debug = Debug("front-final-project:server:middlewares:errors");

export const notFoundError = (request: Request, response: Response) => {
  response.status(404).json({ error: "Endpoint not found" });
};

export const generalError = (
  error: CustomError,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const errorCode = error.code;
  const status = error.statusCode ?? 500;
  let errorMessage = error.publicMessage ?? "Everything has gone wrong";

  if (error instanceof ValidationError) {
    debug(chalk.red("Request validation error:"));
    error.details.body.forEach((errorInfo) => {
      debug(chalk.red(errorInfo.message));
    });
    errorMessage = "Wrong data";
  }

  debug(chalk.red(error.message, errorCode));

  response.status(status).json({ error: errorMessage });
};

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
  error: CustomError | ValidationError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    const errorCode = error.code;
    const status = error.statusCode ?? 500;
    const errorMessage = error.publicMessage ?? "Everything went wrong";

    debug(chalk.red(error.message, errorCode));

    res.status(status).json({ error: errorMessage });
  }

  if (error instanceof ValidationError) {
    debug(chalk.red("Request validation errors: "));
    error.details.body.forEach((errorInfo) => {
      debug(chalk.red(errorInfo.message));
    });

    const status = error.statusCode;

    const errorMessage = "Wrong data";
    res.status(status).json({ error: errorMessage });
  }
};

import "../../loadEnvironment";
import { Request, Response } from "express";

const notFoundError = (request: Request, response: Response) => {
  response.status(404).json({ error: "Endpoint not found" });
};

export default notFoundError;

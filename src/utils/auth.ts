import "../loadEnvironment";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../interfaces/CustomJwtPayload";

export const hashCreator = (text: string) => {
  const salt = 10;
  return bcrypt.hash(text, salt);
};

export const createToken = (payload: CustomJwtPayload) =>
  jwt.sign(payload, process.env.SECRET);

export const hashCompare = (text: string, hash: string) =>
  bcrypt.compare(text, hash);
